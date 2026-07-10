import { createSession, hashPassword } from "@/lib/auth";
import { updateDb, uid, withoutSecrets } from "@/lib/db";
import { jsonError, requireString, validateEmail, validatePassword } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = requireString(form.get("name"), "Name", 2, 80);
    const email = validateEmail(form.get("email"));
    const password = validatePassword(form.get("password"));

    const user = updateDb((db) => {
      if (db.users.some((item) => item.email === email)) {
        throw new Error("An account with that email already exists.");
      }
      const created = {
        id: uid("user"),
        name,
        email,
        passwordHash: hashPassword(password),
        role: db.users.length === 0 ? ("admin" as const) : ("member" as const),
        createdAt: new Date().toISOString()
      };
      db.users.push(created);
      return created;
    });

    await createSession(user.id);
    return Response.json({ user: withoutSecrets(user) });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not create account.");
  }
}
