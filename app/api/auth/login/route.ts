import { createSession, verifyPassword } from "@/lib/auth";
import { readDb, withoutSecrets } from "@/lib/db";
import { jsonError, validateEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const email = validateEmail(form.get("email"));
    const password = String(form.get("password") ?? "");
    const db = await readDb();
    const user = db.users.find((item) => item.email === email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return jsonError("Email or password is incorrect.", 401);
    }
    await createSession(user.id);
    return Response.json({ user: withoutSecrets(user) });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not sign in.");
  }
}
