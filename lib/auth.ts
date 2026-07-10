import { cookies } from "next/headers";
import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { readDb, uid, updateDb, withoutSecrets } from "./db";

const cookieName = "linkvault_session";
const iterations = 180000;

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return `pbkdf2:${iterations}:${salt.toString("base64")}:${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [scheme, iterRaw, saltRaw, hashRaw] = stored.split(":");
  if (scheme !== "pbkdf2" || !iterRaw || !saltRaw || !hashRaw) {
    return false;
  }
  const expected = Buffer.from(hashRaw, "base64");
  const actual = pbkdf2Sync(password, Buffer.from(saltRaw, "base64"), Number(iterRaw), expected.length, "sha256");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function hashIp(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

export async function createSession(userId: string) {
  const session = updateDb((db) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 14);
    const created = {
      id: uid("sess"),
      userId,
      expiresAt: expires.toISOString(),
      createdAt: new Date().toISOString()
    };
    db.sessions.push(created);
    return created;
  });

  const store = await cookies();
  store.set(cookieName, session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt)
  });
}

export async function clearSession() {
  const store = await cookies();
  const id = store.get(cookieName)?.value;
  if (id) {
    updateDb((db) => {
      db.sessions = db.sessions.filter((session) => session.id !== id);
    });
  }
  store.delete(cookieName);
}

export async function currentUser() {
  const store = await cookies();
  const sessionId = store.get(cookieName)?.value;
  if (!sessionId) {
    return null;
  }
  const db = readDb();
  const session = db.sessions.find((item) => item.id === sessionId);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
    return null;
  }
  const user = db.users.find((item) => item.id === session.userId);
  return user ? withoutSecrets(user) : null;
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
