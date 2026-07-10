import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { lastNDays } from "@/lib/links";
import { jsonError } from "@/lib/validation";

export async function GET() {
  try {
    const user = await requireUser();
    const db = readDb();
    const links = db.links.filter((link) => link.userId === user.id);
    const ids = new Set(links.map((link) => link.id));
    const clicks = db.clicks.filter((click) => ids.has(click.linkId));
    const bySource = links.reduce<Record<string, number>>((acc, link) => {
      const source = link.source || "direct";
      acc[source] = (acc[source] ?? 0) + clicks.filter((click) => click.linkId === link.id).length;
      return acc;
    }, {});
    return Response.json({
      totals: {
        links: links.length,
        active: links.filter((link) => link.status === "active").length,
        clicks: clicks.length,
        week: lastNDays(clicks, 7).reduce((sum, count) => sum + count, 0)
      },
      trend: lastNDays(clicks, 14),
      bySource
    });
  } catch {
    return jsonError("Please sign in to view analytics.", 401);
  }
}
