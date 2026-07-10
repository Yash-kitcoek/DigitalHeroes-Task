const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type FieldErrors = Record<string, string>;

export function requireString(value: FormDataEntryValue | null, field: string, min = 1, max = 160) {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length < min) {
    throw new Error(`${field} is required.`);
  }
  if (text.length > max) {
    throw new Error(`${field} must be ${max} characters or less.`);
  }
  return text;
}

export function optionalString(value: FormDataEntryValue | null, max = 500) {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length > max) {
    throw new Error(`Value must be ${max} characters or less.`);
  }
  return text;
}

export function validateEmail(value: FormDataEntryValue | null) {
  const email = requireString(value, "Email", 3, 180).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  return email;
}

export function validatePassword(value: FormDataEntryValue | null) {
  const password = requireString(value, "Password", 8, 120);
  if (!/[a-z]/i.test(password) || !/[0-9]/.test(password)) {
    throw new Error("Password must include a letter and a number.");
  }
  return password;
}

export function validateUrl(value: FormDataEntryValue | null) {
  const text = requireString(value, "Destination URL", 8, 2048);
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    throw new Error("Enter a valid URL.");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }
  return url.toString();
}

export function validateSlug(value: FormDataEntryValue | null) {
  const slug = optionalString(value, 64).toLowerCase();
  if (slug && !slugPattern.test(slug)) {
    throw new Error("Slug must use lowercase letters, numbers, and hyphens.");
  }
  return slug;
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
