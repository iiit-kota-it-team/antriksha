"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function GoogleSignIn() {
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        console.error("Google Sign-In Error:", error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn} className="bg-orange-600 text-white">
        Sign in with Google
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
