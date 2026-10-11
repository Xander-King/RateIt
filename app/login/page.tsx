import Link from "next/link";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="page-heading mb-6 text-2xl">Log in</h1>

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

        <form action={signIn} className="flex flex-col gap-4">
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
          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="field"
            />
            <Link href="/ForgotPassword" className="link-muted mt-1 inline-block">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn-primary mt-2"
          >
            Log in
          </button>
        </form>

        <p className="mt-4 text-sm muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="link-inline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
