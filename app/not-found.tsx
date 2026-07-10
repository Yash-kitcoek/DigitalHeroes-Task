import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap">
      <section className="docs">
        <h1>That link is not available</h1>
        <p className="muted">The short link may be paused, deleted, or mistyped.</p>
        <Link className="button" href="/">Go home</Link>
      </section>
    </main>
  );
}
