"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Handles the implicit-flow redirect from Supabase's default (unedited)
// "Confirm signup" and "Reset password" email templates. The session tokens
// arrive in the URL hash fragment, which only the browser can read, so this
// can't be a server route — the Supabase browser client picks them up
// automatically (detectSessionInUrl) when it initializes here.
//
// Recovery links fire a distinct PASSWORD_RECOVERY event (rather than
// SIGNED_IN), which is why we can't just check getSession() here — that
// would send recovery sessions to /home in a race with this listener.
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        router.replace("/ResetPassword");
      } else if (session) {
        router.replace("/home");
      }
    });

    const timeout = setTimeout(() => setError(true), 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <p>
      {error
        ? "Could not confirm your email. Please try logging in, or request a new confirmation link."
        : "Confirming your email…"}
    </p>
  );
}