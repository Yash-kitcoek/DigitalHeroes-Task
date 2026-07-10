import { hashIp } from "@/lib/auth";
import { uid, updateDb } from "@/lib/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const requestHeaders = await headers();
  const destination = updateDb((db) => {
    const link = db.links.find((item) => item.slug === slug && item.status === "active");
    if (!link) {
      return null;
    }
    db.clicks.push({
      id: uid("clk"),
      linkId: link.id,
      userAgent: requestHeaders.get("user-agent") ?? "unknown",
      referrer: requestHeaders.get("referer") ?? "direct",
      ipHash: hashIp(requestHeaders.get("x-forwarded-for") ?? "local"),
      country: requestHeaders.get("x-vercel-ip-country") ?? "unknown",
      createdAt: new Date().toISOString()
    });
    return link.destinationUrl;
  });
  if (!destination) {
    notFound();
  }
  redirect(destination);
}
