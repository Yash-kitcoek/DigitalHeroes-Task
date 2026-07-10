import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata = {
  title: "Create Account - Link Management Software",
  description: "Create a free LinkVault account to manage branded campaign short links."
};

export default function SignupPage() {
  return (
    <main className="wrap">
      <nav className="nav"><Link className="brand" href="/"><span className="mark" /> LinkVault</Link></nav>
      <section className="docs">
        <h1>Create your workspace</h1>
        <p className="muted">Start tracking campaign links with real persistence, search, and analytics.</p>
        <Suspense fallback={<div className="empty">Loading form...</div>}>
          <AuthForm mode="signup" />
        </Suspense>
        <p className="muted">Already have an account? <Link href="/login">Sign in</Link>.</p>
      </section>
    </main>
  );
}
