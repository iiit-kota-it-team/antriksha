import { createClient } from "@/lib/supabase/server";
import { IUser } from "@/lib/types/user";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

async function generateCustomJWT(user: IUser) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  return await new SignJWT({
    google_id: user.google_id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

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
          const temp_user: IUser = {
            name: data.user.user_metadata.full_name,
            email: data.user.email!,
            google_id: data.user.id,
            role: "user",
          };

          const token = await generateCustomJWT(temp_user);

          const onBoardingUrl = new URL(`${origin}/onboarding`);

          onBoardingUrl.searchParams.set("token", token);

          return NextResponse.redirect(onBoardingUrl.toString());
        } else {
          const temp_user: IUser = {
            name: data.user.user_metadata.full_name,
            email: data.user.email!,
            google_id: data.user.id,
            role: users[0].role,
          };
          const token = await generateCustomJWT(temp_user);

          const response = NextResponse.redirect(`${origin}/dashboard`);
          response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
          });
          return response;
        }
      }
    }

    return NextResponse.redirect(`${origin}/login`);
  }

  // Handle error or invalid code
  return NextResponse.redirect(`${origin}/login`);
}
