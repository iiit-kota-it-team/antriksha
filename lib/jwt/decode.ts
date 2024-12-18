"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function decodeUserJwt() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return { error: "No Token Found" };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    return {
      user: {
        name: payload.name as string,
        email: payload.email as string,
        google_id: payload.google_id as string,
        role: payload.role as string,
      },
    };
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return { error: "Invalid token" };
  }
}

export async function decodeAdminJWT() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return { error: "No Token Found" };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (payload.role != "admin") {
      return { error: "not authorized" };
    }

    return {
      user: {
        name: payload.name as string,
        email: payload.email as string,
        google_id: payload.google_id as string,
        role: payload.role as string,
      },
    };
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return { error: "Invalid token" };
  }
}

export async function decodeOnboardingToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    return {
      user: {
        name: payload.name as string,
        email: payload.email as string,
        google_id: payload.google_id as string,
        role: payload.role as string,
      },
    };
  } catch (error) {
    console.error("Token Verification Error:", error);
    return { error: "Invalid or expired token" };
  }
}
