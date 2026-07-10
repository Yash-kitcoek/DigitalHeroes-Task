import { requireUser } from "@/lib/auth";
import { readDb, uid, updateDb } from "@/lib/db";
import { attachStats, makeSlug, uniquifySlug } from "@/lib/links";
import type { LinkStatus } from "@/lib/types";
import { jsonError, optionalString, requireString, validateSlug, validateUrl } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.toLowerCase() ?? "";
    const status = url.searchParams.get("status") ?? "all";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const pageSize = 8;
    const db = await readDb();
    const links = db.links
      .filter((link) => link.userId === user.id)
      .filter((link) => status === "all" || link.status === status)
      .filter((link) => {
        const haystack = `${link.title} ${link.slug} ${link.campaign} ${link.source} ${link.medium}`.toLowerCase();
        return !query || haystack.includes(query);
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const rows = links.slice((page - 1) * pageSize, page * pageSize).map((link) => attachStats(link, db.clicks));
    return Response.json({ rows, total: links.length, page, pageSize });
  } catch {
    return jsonError("Please sign in to view links.", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const form = await request.formData();
    const title = requireString(form.get("title"), "Title", 2, 120);
    const destinationUrl = validateUrl(form.get("destinationUrl"));
    const campaign = optionalString(form.get("campaign"), 80);
    const source = optionalString(form.get("source"), 80);
    const medium = optionalString(form.get("medium"), 80);
    const notes = optionalString(form.get("notes"), 500);
    const requestedSlug = validateSlug(form.get("slug")) || makeSlug(title);

    const link = await updateDb((db) => {
      const slug = uniquifySlug(requestedSlug, db.links);
      const now = new Date().toISOString();
      const created = {
        id: uid("link"),
        userId: user.id,
        title,
        destinationUrl,
        slug,
        campaign,
        source,
        medium,
        status: "active" as LinkStatus,
        notes,
        createdAt: now,
        updatedAt: now
      };
      db.links.push(created);
      return created;
    });

    return Response.json({ link }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not create link.");
  }
}
