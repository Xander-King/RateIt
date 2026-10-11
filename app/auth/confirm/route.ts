import { type EmailOtpType, PostgrestError, type SupabaseClient, type User, createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function upsertUserInfo(supabase: SupabaseClient, user: User) {
  const userName = (user.user_metadata as { UserName?: string } | null)?.UserName;

  // The @supabase/ssr server client doesn't reliably pick up the freshly
  // exchanged session's access token for this same-request write (confirmed:
  // the session/JWT checked out, but the write still ran as anon). Forcing
  // a client explicitly authenticated with that token sidesteps it.
  const { data: sessionData } = await supabase.auth.getSession();

  console.log("upsertUserInfo: has session?", !!sessionData.session, "user.id:", user.id);

  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    console.error("upsertUserInfo: no access token on session, aborting upsert");
    return { message: "No session available to authorize the UserInfo write" } as PostgrestError;
  }

  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString());
    console.log("upsertUserInfo: token claims ->", { role: payload.role, sub: payload.sub, aud: payload.aud, exp: payload.exp, now: Math.floor(Date.now() / 1000) });
  } catch (e) {
    console.error("upsertUserInfo: failed to decode access token", e);
  }

  const authedSupabase = createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  const { error } = await authedSupabase
    .from("UserInfo")
    .upsert(
      {
        UserKey: user.id,
        ProfilePicPath: "Default avatar@1x.png",
        ...(userName ? { UserName: userName } : {}),
      },
      { onConflict: "UserKey" }
    );

  if (error) {
    console.error("UserInfo upsert failed:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  return error;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  const supabase = createClient();

  // Supabase's default (unedited) email templates use the PKCE flow: the
  // link goes to Supabase's own /auth/v1/verify, which redirects back here
  // with just a `code` param to exchange for a session.
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("exchangeCodeForSession failed:", error);
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data.user) {
      const upsertError = await upsertUserInfo(supabase, data.user);
      if (upsertError) {
        redirect(`/login?error=${encodeURIComponent(upsertError.message)}`);
      }
      redirect(next);
    }
  }

  // Supports a custom email template using the token_hash/type format
  // (e.g. `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=...`).
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (error) {
      console.error("verifyOtp failed:", error);
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data.user) {
      const upsertError = await upsertUserInfo(supabase, data.user);
      if (upsertError) {
        redirect(`/login?error=${encodeURIComponent(upsertError.message)}`);
      }
      redirect(next);
    }
  }

  redirect("/login?error=Could not verify email");
}
