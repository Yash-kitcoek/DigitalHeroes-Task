import type { Click, Link, LinkWithStats } from "./types";

export function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 44);
  return base || `link-${Math.random().toString(36).slice(2, 8)}`;
}

export function uniquifySlug(slug: string, links: Link[], ignoreId?: string) {
  let next = slug;
  let index = 2;
  while (links.some((link) => link.slug === next && link.id !== ignoreId)) {
    next = `${slug}-${index}`;
    index += 1;
  }
  return next;
}

export function attachStats(link: Link, clicks: Click[]): LinkWithStats {
  const linkClicks = clicks.filter((click) => click.linkId === link.id);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  return {
    ...link,
    totalClicks: linkClicks.length,
    lastSevenDays: linkClicks.filter((click) => new Date(click.createdAt) >= weekStart).length,
    sparkline: lastNDays(linkClicks, 14)
  };
}

export function lastNDays(clicks: Click[], days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - index - 1));
    const stamp = date.toISOString().slice(0, 10);
    return clicks.filter((click) => click.createdAt.slice(0, 10) === stamp).length;
  });
}

export function toCsv(rows: LinkWithStats[]) {
  const header = ["title", "slug", "destinationUrl", "campaign", "source", "medium", "status", "totalClicks"];
  const body = rows.map((row) =>
    header
      .map((key) => {
        const value = String(row[key as keyof LinkWithStats] ?? "");
        return `"${value.replaceAll('"', '""')}"`;
      })
      .join(",")
  );
  return [header.join(","), ...body].join("\n");
}
