"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Sparkline } from "./Sparkline";

type Row = {
  id: string;
  title: string;
  slug: string;
  destinationUrl: string;
  campaign: string;
  source: string;
  medium: string;
  status: "active" | "paused";
  totalClicks: number;
  lastSevenDays: number;
  sparkline: number[];
};

export function LinksClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), status });
    if (q) params.set("q", q);
    return params.toString();
  }, [page, q, status]);

  useEffect(() => {
    let live = true;
    setLoading(true);
    fetch(`/api/links?${query}`)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Could not load links.");
        return payload;
      })
      .then((payload) => {
        if (!live) return;
        setRows(payload.rows);
        setTotal(payload.total);
        setError("");
      })
      .catch((caught: Error) => live && setError(caught.message))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [query, refresh]);

  async function create(formData: FormData) {
    const response = await fetch("/api/links", { method: "POST", body: formData });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Could not create link.");
      return;
    }
    setRefresh((value) => value + 1);
    setPage(1);
  }

  async function remove(id: string) {
    const response = await fetch(`/api/links/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Could not delete link.");
      return;
    }
    setRefresh((value) => value + 1);
  }

  const pages = Math.max(1, Math.ceil(total / 8));

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <section className="panel">
        <h2>Create a short link</h2>
        <form className="form" action={create}>
          <div className="stat-grid">
            <label className="field">
              <span>Title</span>
              <input name="title" placeholder="Summer launch landing page" required />
            </label>
            <label className="field">
              <span>Destination URL</span>
              <input name="destinationUrl" placeholder="https://example.com/page" required />
            </label>
            <label className="field">
              <span>Custom slug</span>
              <input name="slug" placeholder="summer-launch" />
            </label>
          </div>
          <div className="stat-grid">
            <label className="field">
              <span>Campaign</span>
              <input name="campaign" placeholder="Launch Q3" />
            </label>
            <label className="field">
              <span>Source</span>
              <input name="source" placeholder="newsletter" />
            </label>
            <label className="field">
              <span>Medium</span>
              <input name="medium" placeholder="email" />
            </label>
          </div>
          <label className="field">
            <span>Notes</span>
            <textarea name="notes" placeholder="Internal context for the campaign team." />
          </label>
          <button>Create link</button>
        </form>
      </section>

      <section>
        <div className="toolbar">
          <div>
            <h1 style={{ margin: 0 }}>Links</h1>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              Search, filter, export, and inspect campaign performance.
            </p>
          </div>
          <a className="button secondary" href="/api/links/export">
            Export CSV
          </a>
        </div>
        <div className="toolbar">
          <input aria-label="Search links" placeholder="Search title, slug, campaign..." value={q} onChange={(event) => { setQ(event.target.value); setPage(1); }} />
          <select aria-label="Filter status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        {error ? <p className="error">{error}</p> : null}
        {loading ? <div className="empty">Loading links...</div> : rows.length === 0 ? <div className="empty">No links match this view. Create one or clear the filters.</div> : (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Short link</th>
                  <th>Campaign</th>
                  <th>Clicks</th>
                  <th>Trend</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link className="mono" href={`/dashboard/links/${row.id}`}>/r/{row.slug}</Link>
                      <div className="muted">{row.title}</div>
                    </td>
                    <td>{row.campaign || "Unassigned"}<div className="muted">{row.source || "direct"} / {row.medium || "none"}</div></td>
                    <td><strong>{row.totalClicks}</strong><div className="muted">{row.lastSevenDays} last 7 days</div></td>
                    <td><Sparkline values={row.sparkline} /></td>
                    <td><span className="badge">{row.status}</span></td>
                    <td>
                      <div className="actions" style={{ margin: 0 }}>
                        <Link className="button secondary" href={`/dashboard/links/${row.id}`}>Open</Link>
                        <button className="danger" type="button" onClick={() => remove(row.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="toolbar" style={{ marginTop: 16 }}>
          <span className="muted">Page {page} of {pages}</span>
          <div className="actions" style={{ margin: 0 }}>
            <button className="secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
            <button className="secondary" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
