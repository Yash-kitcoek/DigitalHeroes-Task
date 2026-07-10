import { supabase } from "./supabase";
import type { Click, Database, Link, Session, User } from "./types";

const emptyDb = (): Database => ({
  users: [],
  links: [],
  clicks: [],
  sessions: []
});

// --- row <-> app object mapping (DB uses snake_case, app uses camelCase) ---

function userToRow(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    password_hash: u.passwordHash,
    role: u.role,
    created_at: u.createdAt
  };
}
function rowToUser(r: any): User {
  return { id: r.id, name: r.name, email: r.email, passwordHash: r.password_hash, role: r.role, createdAt: r.created_at };
}

function linkToRow(l: Link) {
  return {
    id: l.id,
    user_id: l.userId,
    title: l.title,
    destination_url: l.destinationUrl,
    slug: l.slug,
    campaign: l.campaign,
    source: l.source,
    medium: l.medium,
    status: l.status,
    notes: l.notes,
    created_at: l.createdAt,
    updated_at: l.updatedAt
  };
}
function rowToLink(r: any): Link {
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title,
    destinationUrl: r.destination_url,
    slug: r.slug,
    campaign: r.campaign,
    source: r.source,
    medium: r.medium,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

function clickToRow(c: Click) {
  return {
    id: c.id,
    link_id: c.linkId,
    user_agent: c.userAgent,
    referrer: c.referrer,
    ip_hash: c.ipHash,
    country: c.country,
    created_at: c.createdAt
  };
}
function rowToClick(r: any): Click {
  return {
    id: r.id,
    linkId: r.link_id,
    userAgent: r.user_agent,
    referrer: r.referrer,
    ipHash: r.ip_hash,
    country: r.country,
    createdAt: r.created_at
  };
}

function sessionToRow(s: Session) {
  return { id: s.id, user_id: s.userId, expires_at: s.expiresAt, created_at: s.createdAt };
}
function rowToSession(r: any): Session {
  return { id: r.id, userId: r.user_id, expiresAt: r.expires_at, createdAt: r.created_at };
}

// --- generic sync helpers ---

async function deleteExtra(table: string, keepIds: string[]) {
  if (keepIds.length === 0) {
    const { error } = await supabase.from(table).delete().not("id", "is", null);
    if (error) throw new Error(`Failed clearing ${table}: ${error.message}`);
    return;
  }
  const { error } = await supabase.from(table).delete().not("id", "in", `(${keepIds.join(",")})`);
  if (error) throw new Error(`Failed pruning ${table}: ${error.message}`);
}

async function upsertRows(table: string, rows: unknown[]) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows as any[]);
  if (error) throw new Error(`Failed writing ${table}: ${error.message}`);
}

export async function readDb(): Promise<Database> {
  const [{ data: users, error: usersErr }, { data: links, error: linksErr }, { data: clicks, error: clicksErr }, { data: sessions, error: sessionsErr }] =
    await Promise.all([
      supabase.from("users").select("*"),
      supabase.from("links").select("*"),
      supabase.from("clicks").select("*"),
      supabase.from("sessions").select("*")
    ]);

  if (usersErr || linksErr || clicksErr || sessionsErr) {
    const message = usersErr?.message || linksErr?.message || clicksErr?.message || sessionsErr?.message;
    throw new Error(`Failed reading database: ${message}`);
  }

  if (!users || users.length === 0) {
    const seeded = seedDatabase();
    await writeDb(seeded);
    return seeded;
  }

  return {
    users: users.map(rowToUser),
    links: (links ?? []).map(rowToLink),
    clicks: (clicks ?? []).map(rowToClick),
    sessions: (sessions ?? []).map(rowToSession)
  };
}

export async function writeDb(db: Database): Promise<void> {
  // Delete children before parents to satisfy foreign keys.
  await deleteExtra(
    "clicks",
    db.clicks.map((c) => c.id)
  );
  await deleteExtra(
    "sessions",
    db.sessions.map((s) => s.id)
  );
  await deleteExtra(
    "links",
    db.links.map((l) => l.id)
  );
  await deleteExtra(
    "users",
    db.users.map((u) => u.id)
  );

  // Insert/update parents before children.
  await upsertRows("users", db.users.map(userToRow));
  await upsertRows("links", db.links.map(linkToRow));
  await upsertRows("sessions", db.sessions.map(sessionToRow));
  await upsertRows("clicks", db.clicks.map(clickToRow));
}

export async function updateDb<T>(callback: (db: Database) => T): Promise<T> {
  const db = await readDb();
  const result = callback(db);
  await writeDb(db);
  return result;
}

export function uid(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}`;
}

export function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function seedDatabase(): Database {
  const db = emptyDb();
  const user: User = {
    id: "user_demo",
    name: "Demo Marketer",
    email: "demo@linkvault.local",
    passwordHash:
      "pbkdf2:180000:fr8WF4MEXS+6UZjnbQWflg==:NOKStFhcRKZqDkfcgm5wd9wPFD8ucvweViWY6RIQXIc=",
    role: "admin",
    createdAt: daysAgo(28)
  };
  db.users.push(user);

  const links: Link[] = [
    {
      id: "link_launch",
      userId: user.id,
      title: "Summer Launch Landing Page",
      destinationUrl: "https://example.com/summer-launch?utm_source=newsletter&utm_medium=email",
      slug: "summer-launch",
      campaign: "Summer Launch",
      source: "newsletter",
      medium: "email",
      status: "active",
      notes: "Primary announcement link for launch week.",
      createdAt: daysAgo(18),
      updatedAt: daysAgo(3)
    },
    {
      id: "link_partner",
      userId: user.id,
      title: "Partner Webinar Registration",
      destinationUrl: "https://example.com/webinar?utm_source=partners&utm_medium=referral",
      slug: "partner-webinar",
      campaign: "Webinar",
      source: "partners",
      medium: "referral",
      status: "active",
      notes: "Shared by three affiliate partners.",
      createdAt: daysAgo(14),
      updatedAt: daysAgo(1)
    },
    {
      id: "link_social",
      userId: user.id,
      title: "Founder LinkedIn Post",
      destinationUrl: "https://example.com/founder-note?utm_source=linkedin&utm_medium=social",
      slug: "founder-note",
      campaign: "Founder Social",
      source: "linkedin",
      medium: "social",
      status: "paused",
      notes: "Paused after campaign copy was refreshed.",
      createdAt: daysAgo(10),
      updatedAt: daysAgo(2)
    }
  ];
  db.links.push(...links);

  links.forEach((link, linkIndex) => {
    for (let day = 13; day >= 0; day -= 1) {
      const count = ((day + 2) * (linkIndex + 3)) % 9;
      for (let i = 0; i < count; i += 1) {
        const click: Click = {
          id: uid("clk"),
          linkId: link.id,
          userAgent: "Seed Browser",
          referrer: i % 2 === 0 ? "https://google.com" : "https://linkedin.com",
          ipHash: `seed-${day}-${i}`,
          country: ["US", "IN", "GB"][i % 3],
          createdAt: daysAgo(day)
        };
        db.clicks.push(click);
      }
    }
  });

  return db;
}

export function withoutSecrets(user: User) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export function purgeExpiredSessions(db: Database) {
  const now = Date.now();
  db.sessions = db.sessions.filter((session: Session) => new Date(session.expiresAt).getTime() > now);
}
