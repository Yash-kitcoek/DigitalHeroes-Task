import Link from "next/link";
import { currentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await currentUser();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LinkVault",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I use LinkVault without a paid database?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. The local demo persists data to a JSON file so reviewers can run the full app without provisioning services." }
      },
      {
        "@type": "Question",
        name: "Does LinkVault track real clicks?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Every active short-link redirect records a click event with referrer, user agent, timestamp, and privacy-preserving IP hash." }
      }
    ]
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="wrap">
        <nav className="nav" aria-label="Primary">
          <Link className="brand" href="/"><span className="mark" /> LinkVault</Link>
          <div className="navlinks">
            <Link className="button secondary" href="/docs/getting-started">Docs</Link>
            {user ? <Link className="button" href="/dashboard">Dashboard</Link> : <Link className="button" href="/login">Demo login</Link>}
          </div>
        </nav>
        <section className="hero">
          <div>
            <h1>Short links that prove which campaign worked.</h1>
            <p className="lead">
              LinkVault gives growth teams branded URLs, tidy UTM context, click analytics, and a focused dashboard they can use without spreadsheet cleanup.
            </p>
            <div className="actions">
              <Link className="button" href={user ? "/dashboard" : "/signup"}>{user ? "Open dashboard" : "Start free"}</Link>
              <Link className="button secondary" href="/login">Use demo account</Link>
            </div>
          </div>
          <div className="panel" aria-label="Product preview">
            <div className="toolbar"><strong>Campaign pulse</strong><span className="badge">live</span></div>
            <div className="stat-grid">
              <div className="stat"><span className="muted">Links</span><strong>38</strong></div>
              <div className="stat"><span className="muted">Clicks</span><strong>9.4k</strong></div>
              <div className="stat"><span className="muted">CTR lift</span><strong>18%</strong></div>
            </div>
            <div className="table" style={{ marginTop: 16 }}>
              <table>
                <tbody>
                  <tr><td className="mono">/r/summer-launch</td><td><span className="badge">active</span></td><td>2,183 clicks</td></tr>
                  <tr><td className="mono">/r/partner-webinar</td><td><span className="badge">active</span></td><td>876 clicks</td></tr>
                  <tr><td className="mono">/r/founder-note</td><td><span className="badge">paused</span></td><td>412 clicks</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="feature-grid" aria-label="Features">
          <div className="feature"><h2>Branded slugs</h2><p className="muted">Create memorable short paths with collision-safe slug generation and edit controls.</p></div>
          <div className="feature"><h2>Click analytics</h2><p className="muted">Track referrers, countries, recent clicks, and 14-day campaign movement.</p></div>
          <div className="feature"><h2>Review-ready repo</h2><p className="muted">Auth, CRUD, search, filters, export, SEO, docs, license, and a clean setup story.</p></div>
        </section>
        <footer className="nav" style={{ marginTop: 48 }}>
          <span className="muted">Built for the Digital Heroes Full Stack Developer Trial.</span>
          <Link href="/docs/deploy">Deployment notes</Link>
        </footer>
      </div>
    </main>
  );
}
