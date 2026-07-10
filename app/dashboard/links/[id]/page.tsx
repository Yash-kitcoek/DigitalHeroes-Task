import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkDetailClient } from "@/components/LinkDetailClient";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { attachStats } from "@/lib/links";

export const metadata = {
  title: "Link Detail - Short Link Analytics",
  description: "Inspect, edit, and review recent click events for one branded short link."
};

export default async function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const db = await readDb();
  const link = db.links.find((item) => item.id === id && item.userId === user.id);
  if (!link) notFound();
  const detail = {
    link: attachStats(link, db.clicks),
    recentClicks: db.clicks.filter((click) => click.linkId === link.id).slice(-40).reverse()
  };
  return (
    <>
      <div className="toolbar">
        <div>
          <Link className="muted" href="/dashboard/links">Back to links</Link>
          <h1 style={{ margin: "8px 0 0" }}>{link.title}</h1>
        </div>
      </div>
      <LinkDetailClient detail={detail} />
    </>
  );
}
