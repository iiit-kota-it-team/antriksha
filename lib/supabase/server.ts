import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach((cookie) => {
              cookieStore.set({
                name: cookie.name,
                value: cookie.value,
                ...cookie.options,
              });
            });
          } catch (error) {
            console.error("Failed to set cookies:", error);
          }
        },
      },
    },
  );
}
