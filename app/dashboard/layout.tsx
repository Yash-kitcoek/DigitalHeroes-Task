import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <main>
      <div className="wrap">
        <nav className="nav">
          <Link className="brand" href="/"><span className="mark" /> LinkVault</Link>
          <span className="muted">{user.name} · {user.role}</span>
        </nav>
        <div className="shell">
          <aside className="sidebar" aria-label="Dashboard">
            <Link href="/dashboard">Overview</Link>
            <Link href="/dashboard/links">Links</Link>
            <Link href="/docs/getting-started">Docs</Link>
            <LogoutButton />
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}
