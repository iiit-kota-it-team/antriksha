import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const cookieStore = await cookies();

  const { error } = await supabase.auth.signOut();

  if (!error) {
    cookieStore.delete("sb-access-token");
    cookieStore.delete("sb-refresh-token");

    return NextResponse.redirect("http://localhost:3000/");
  }

  return NextResponse.json({ error: "Logout failed" }, { status: 500 });
}
