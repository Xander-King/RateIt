import Link from "next/link";
import { forgotPassword } from "@/lib/actions/auth";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="page-heading mb-6 text-2xl">Forgot password</h1>

        {searchParams.message && (
          <p className="alert-info">
            {searchParams.message}
          </p>
        )}
        {searchParams.error && (
          <p className="alert-error">
            {searchParams.error}
          </p>
        )}

        <p className="mb-4 text-sm muted">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        <form action={forgotPassword} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="field"
            />
          </div>
          <button
            type="submit"
            className="btn-primary mt-2"
          >
            Send reset link
          </button>
        </form>

        <p className="mt-4 text-sm muted">
          Remembered your password?{" "}
          <Link href="/login" className="link-inline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
