"use server";

import { cookies } from "next/headers";

export async function SetCookies(value: string) {
  const cookieStore = await cookies();
  try {
    cookieStore.set("auth-token", value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
}
