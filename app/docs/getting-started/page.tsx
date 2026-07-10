import Link from "next/link";

export const metadata = {
  title: "Getting Started - LinkVault Setup Guide",
  description: "Install LinkVault locally, use the demo login, and create your first branded short link."
};

export default function GettingStartedPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/` },
      { "@type": "ListItem", position: 2, name: "Getting Started", item: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/docs/getting-started` }
    ]
  };
  return (
    <main className="docs">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Link className="brand" href="/"><span className="mark" /> LinkVault</Link>
      <article>
        <h1>Getting started</h1>
        <p>Install dependencies, copy <code>.env.example</code> to <code>.env.local</code>, then run <code>npm run dev</code>.</p>
        <p>The local demo creates seed data automatically in <code>data/linkvault.json</code>. Sign in with <code>demo@linkvault.local</code> and <code>Demo1234</code>.</p>
        <p>Create a link from the Links page, open <code>/r/your-slug</code>, and return to the dashboard to see click analytics update.</p>
      </article>
    </main>
  );
}
