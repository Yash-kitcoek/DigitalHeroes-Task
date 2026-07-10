import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { attachStats, toCsv } from "@/lib/links";
import { jsonError } from "@/lib/validation";

export async function GET() {
  try {
    const user = await requireUser();
    const db = readDb();
    const rows = db.links.filter((link) => link.userId === user.id).map((link) => attachStats(link, db.clicks));
    return new Response(toCsv(rows), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=linkvault-links.csv"
      }
    });
  } catch {
    return jsonError("Please sign in to export links.", 401);
  }
}
