import { requireUser } from "@/lib/auth";
import { readDb, updateDb } from "@/lib/db";
import { attachStats, makeSlug, uniquifySlug } from "@/lib/links";
import type { LinkStatus } from "@/lib/types";
import { jsonError, optionalString, requireString, validateSlug, validateUrl } from "@/lib/validation";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const db = await readDb();
    const link = db.links.find((item) => item.id === id && item.userId === user.id);
    if (!link) {
      return jsonError("Link not found.", 404);
    }
    const clicks = db.clicks.filter((click) => click.linkId === link.id);
    const recentClicks = clicks.slice(-40).reverse();
    return Response.json({ link: attachStats(link, db.clicks), recentClicks });
  } catch {
    return jsonError("Please sign in to view this link.", 401);
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const form = await request.formData();
    const updated = await updateDb((db) => {
      const link = db.links.find((item) => item.id === id && item.userId === user.id);
      if (!link) {
        throw new Error("Link not found.");
      }
      const title = requireString(form.get("title"), "Title", 2, 120);
      const requestedSlug = validateSlug(form.get("slug")) || makeSlug(title);
      link.title = title;
      link.destinationUrl = validateUrl(form.get("destinationUrl"));
      link.slug = uniquifySlug(requestedSlug, db.links, link.id);
      link.campaign = optionalString(form.get("campaign"), 80);
      link.source = optionalString(form.get("source"), 80);
      link.medium = optionalString(form.get("medium"), 80);
      link.notes = optionalString(form.get("notes"), 500);
      link.status = form.get("status") === "paused" ? ("paused" as LinkStatus) : ("active" as LinkStatus);
      link.updatedAt = new Date().toISOString();
      return link;
    });
    return Response.json({ link: updated });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not update link.");
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    await updateDb((db) => {
      const link = db.links.find((item) => item.id === id && item.userId === user.id);
      if (!link) {
        throw new Error("Link not found.");
      }
      db.links = db.links.filter((item) => item.id !== id);
      db.clicks = db.clicks.filter((click) => click.linkId !== id);
    });
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not delete link.");
  }
}
