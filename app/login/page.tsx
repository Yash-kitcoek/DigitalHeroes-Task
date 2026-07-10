import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata = {
  title: "Login - Branded Short Link Dashboard",
  description: "Sign in to LinkVault to manage branded short links and campaign click analytics."
};

export default function LoginPage() {
  return (
    <main className="wrap">
      <nav className="nav"><Link className="brand" href="/"><span className="mark" /> LinkVault</Link></nav>
      <section className="docs">
        <h1>Welcome back</h1>
        <p className="muted">Use the pre-filled demo account or sign in with your own workspace.</p>
        <Suspense fallback={<div className="empty">Loading form...</div>}>
          <AuthForm mode="login" />
        </Suspense>
        <p className="muted">No account yet? <Link href="/signup">Create one</Link>.</p>
      </section>
    </main>
  );
}
