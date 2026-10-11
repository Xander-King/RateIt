import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resetPassword } from "@/lib/actions/auth";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="page-heading mb-6 text-2xl">Reset password</h1>

        {searchParams.error && (
          <p className="alert-error">
            {searchParams.error}
          </p>
        )}

        <form action={resetPassword} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="field-label">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="field"
            />
          </div>
          <button
            type="submit"
            className="btn-primary mt-2"
          >
            Update password
          </button>
        </form>
      </div>
    </main>
  );
}
