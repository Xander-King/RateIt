import Link from "next/link";
import { signUp } from "@/lib/actions/auth";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  // TODO give everyone a default Profile Pic image until they update it later.
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="page-heading mb-6 text-2xl">Create an account</h1>

        {searchParams.error && (
          <p className="alert-error">
            {searchParams.error}
          </p>
        )}

        <form action={signUp} className="flex flex-col gap-4">
          <div>
            <label htmlFor="UserName" className="field-label">
              Username
            </label>
            <input
              id="UserName"
              name="UserName"
              type="text"
              required
              className="field"
            />
          </div>
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
              minLength={6}
              className="field"
            />
          </div>
          <button
            type="submit"
            className="btn-primary mt-2"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-sm muted">
          Already have an account?{" "}
          <Link href="/login" className="link-inline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
