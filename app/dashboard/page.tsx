import { OverviewClient } from "@/components/OverviewClient";

export const metadata = {
  title: "Dashboard - Short Link Analytics",
  description: "View aggregate branded short-link analytics and campaign source performance."
};

export default function DashboardPage() {
  return (
    <>
      <div className="toolbar">
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p className="muted">A compact read on campaign link performance.</p>
        </div>
      </div>
      <OverviewClient />
    </>
  );
}
