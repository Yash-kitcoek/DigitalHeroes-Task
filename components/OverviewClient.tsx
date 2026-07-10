"use client";

import { useEffect, useState } from "react";
import { Sparkline } from "./Sparkline";

type Analytics = {
  totals: { links: number; active: number; clicks: number; week: number };
  trend: number[];
  bySource: Record<string, number>;
};

export function OverviewClient() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Could not load analytics.");
        return payload;
      })
      .then(setAnalytics)
      .catch((caught: Error) => setError(caught.message));
  }, []);

  if (error) return <div className="empty error">{error}</div>;
  if (!analytics) return <div className="empty">Loading dashboard...</div>;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <section className="stat-grid">
        <div className="stat"><span className="muted">Links</span><strong>{analytics.totals.links}</strong></div>
        <div className="stat"><span className="muted">Active</span><strong>{analytics.totals.active}</strong></div>
        <div className="stat"><span className="muted">Clicks</span><strong>{analytics.totals.clicks}</strong></div>
      </section>
      <section className="panel">
        <div className="toolbar">
          <div><h2 style={{ margin: 0 }}>Click trend</h2><p className="muted">Last 14 days across all active campaign links.</p></div>
          <strong className="mono">{analytics.totals.week} this week</strong>
        </div>
        <Sparkline values={analytics.trend} width={520} height={120} />
      </section>
      <section className="panel">
        <h2>Top sources</h2>
        <div className="feature-grid">
          {Object.entries(analytics.bySource).map(([source, count]) => (
            <div className="feature" key={source}>
              <span className="badge">{source}</span>
              <strong style={{ display: "block", fontSize: 28, marginTop: 12 }}>{count}</strong>
              <span className="muted">clicks attributed</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
