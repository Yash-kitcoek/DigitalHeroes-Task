import Link from "next/link";

export const metadata = {
  title: "Features - Branded Link Analytics",
  description: "Review LinkVault features including auth, CRUD, search, CSV export, redirects, and click analytics."
};

export default function FeaturesPage() {
  return (
    <main className="docs">
      <Link className="brand" href="/"><span className="mark" /> LinkVault</Link>
      <article>
        <h1>Features</h1>
        <p><strong>Authentication:</strong> email/password signup, demo login, HTTP-only sessions, and protected dashboard routes.</p>
        <p><strong>Link management:</strong> create, read, update, delete, search, status filter, pagination, slug collision handling, and CSV export.</p>
        <p><strong>Analytics:</strong> click capture on redirects, aggregate dashboard metrics, per-link trend lines, source breakdown, and recent click tables.</p>
        <p><strong>Polish:</strong> semantic pages, OG image, sitemap, robots, JSON-LD, responsive layout, keyboard-visible focus states, and styled 404.</p>
      </article>
    </main>
  );
}
