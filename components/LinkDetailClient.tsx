"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkline } from "./Sparkline";

type Click = {
  id: string;
  referrer: string;
  country: string;
  createdAt: string;
};

type Detail = {
  link: {
    id: string;
    title: string;
    slug: string;
    destinationUrl: string;
    campaign: string;
    source: string;
    medium: string;
    notes: string;
    status: "active" | "paused";
    totalClicks: number;
    lastSevenDays: number;
    sparkline: number[];
  };
  recentClicks: Click[];
};

export function LinkDetailClient({ detail }: { detail: Detail }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function save(formData: FormData) {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/links/${detail.link.id}`, { method: "PUT", body: formData });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(payload.error ?? "Could not save changes.");
      return;
    }
    router.refresh();
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <section className="stat-grid">
        <div className="stat"><span className="muted">Total clicks</span><strong>{detail.link.totalClicks}</strong></div>
        <div className="stat"><span className="muted">Last 7 days</span><strong>{detail.link.lastSevenDays}</strong></div>
        <div className="stat"><span className="muted">14-day trend</span><Sparkline values={detail.link.sparkline} width={180} height={54} /></div>
      </section>
      <section className="panel">
        <h1>Edit link</h1>
        <p className="muted mono">Public path: /r/{detail.link.slug}</p>
        <form className="form" action={save}>
          <div className="stat-grid">
            <label className="field"><span>Title</span><input name="title" defaultValue={detail.link.title} required /></label>
            <label className="field"><span>Destination URL</span><input name="destinationUrl" defaultValue={detail.link.destinationUrl} required /></label>
            <label className="field"><span>Slug</span><input name="slug" defaultValue={detail.link.slug} required /></label>
          </div>
          <div className="stat-grid">
            <label className="field"><span>Campaign</span><input name="campaign" defaultValue={detail.link.campaign} /></label>
            <label className="field"><span>Source</span><input name="source" defaultValue={detail.link.source} /></label>
            <label className="field"><span>Medium</span><input name="medium" defaultValue={detail.link.medium} /></label>
          </div>
          <label className="field"><span>Status</span><select name="status" defaultValue={detail.link.status}><option value="active">Active</option><option value="paused">Paused</option></select></label>
          <label className="field"><span>Notes</span><textarea name="notes" defaultValue={detail.link.notes} /></label>
          {error ? <p className="error">{error}</p> : null}
          <button disabled={loading}>{loading ? "Saving..." : "Save changes"}</button>
        </form>
      </section>
      <section className="panel">
        <h2>Recent clicks</h2>
        {detail.recentClicks.length === 0 ? <div className="empty">No clicks recorded yet. Share the short link to start collecting analytics.</div> : (
          <div className="table">
            <table>
              <thead><tr><th>Time</th><th>Referrer</th><th>Country</th></tr></thead>
              <tbody>{detail.recentClicks.map((click) => <tr key={click.id}><td>{new Date(click.createdAt).toLocaleString()}</td><td>{click.referrer}</td><td>{click.country}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
