"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/home");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const userName = (formData.get("UserName") as string)?.trim();

  const supabase = createClient();

  if (!userName) {
    redirect(`/signup?error=${encodeURIComponent("Username is required")}`);
  }

  const { data: existing } = await supabase
    .from("UserInfo")
    .select("UserKey")
    .eq("UserName", userName)
    .maybeSingle();

  if (existing) {
    redirect(`/signup?error=${encodeURIComponent("That username is already taken")}`);
  }

  const origin = headers().get("origin");
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Stashed on the auth user itself so /auth/confirm can read it back
      // once the user actually clicks the confirmation link — the UserInfo
      // row isn't created until then (see that route).
      data: { UserName: userName },
      emailRedirectTo: `${origin}/auth/confirm?next=/home`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // If email confirmation is enabled in your Supabase project (default),
  // the user must click the confirmation link before they can log in.
  redirect("/login?message=Check your email to confirm your account");
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  const origin = headers().get("origin");
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback`,
  });

  if (error) {
    redirect(`/ForgotPassword?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Check your email for a link to reset your password");
}

export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string;

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/ResetPassword?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Your password has been updated. Please log in.");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
