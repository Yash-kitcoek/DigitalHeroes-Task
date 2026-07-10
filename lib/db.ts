import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Click, Database, Link, Session, User } from "./types";

// On serverless platforms (Vercel, AWS Lambda, etc.) the deployed code
// directory is read-only — only /tmp is writable, so we store the JSON
// "database" there instead. Locally (and in any writable environment)
// we keep using ./data so nothing changes for local dev.
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dataDir = isServerless ? path.join("/tmp", "linkvault-data") : path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "linkvault.json");

const emptyDb = (): Database => ({
  users: [],
  links: [],
  clicks: [],
  sessions: []
});

export function readDb(): Database {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  if (!existsSync(dataFile)) {
    const seeded = seedDatabase();
    writeDb(seeded);
    return seeded;
  }
  return JSON.parse(readFileSync(dataFile, "utf8")) as Database;
}

export function writeDb(db: Database) {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  writeFileSync(dataFile, `${JSON.stringify(db, null, 2)}\n`);
}

export function updateDb<T>(callback: (db: Database) => T) {
  const db = readDb();
  const result = callback(db);
  writeDb(db);
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
