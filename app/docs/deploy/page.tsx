import Link from "next/link";

export const metadata = {
  title: "Deploy - LinkVault Vercel Guide",
  description: "Deploy LinkVault to Vercel or Netlify and configure required environment variables."
};

export default function DeployPage() {
  return (
    <main className="docs">
      <Link className="brand" href="/"><span className="mark" /> LinkVault</Link>
      <article>
        <h1>Deploy</h1>
        <p>Deploy to Vercel with build command <code>npm run build</code>. Set <code>NEXT_PUBLIC_APP_URL</code> to the production URL and <code>SESSION_SECRET</code> to a long random string.</p>
        <p>The default persistence is file-backed for review simplicity. For a production team, swap <code>lib/db.ts</code> for Postgres, SQLite, or Supabase while keeping the same route contracts.</p>
        <p>After deployment, test signup, demo login, link creation, redirect capture, CSV export, and hard refreshes on dashboard routes.</p>
      </article>
    </main>
  );
}
