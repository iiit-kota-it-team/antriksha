import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("google_id", data.user.id);

      if (!error) {
        if (users.length == 0) {
          const { data: users, error } = await supabase.from("users").upsert({
            name: data.user.user_metadata.full_name,
            email: data.user.email,
            google_id: data.user.id,
          });

          if (!error) {
            console.log(users);
            return NextResponse.redirect(`${origin}/dashboard`);
          }
          console.log(error);
          return NextResponse.redirect(`${origin}/login`);
        } else {
          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }
    }

    return NextResponse.redirect(`${origin}/login`);
  }

  // Handle error or invalid code
  return NextResponse.redirect(`${origin}/login`);
}
