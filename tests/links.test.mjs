import assert from "node:assert/strict";
import test from "node:test";

function makeSlug(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 44);
  return base || `link-${Math.random().toString(36).slice(2, 8)}`;
}

function uniquifySlug(slug, links, ignoreId) {
  let next = slug;
  let index = 2;
  while (links.some((link) => link.slug === next && link.id !== ignoreId)) {
    next = `${slug}-${index}`;
    index += 1;
  }
  return next;
}

test("makeSlug normalizes campaign titles", () => {
  assert.equal(makeSlug("Summer Launch: Email #1"), "summer-launch-email-1");
});

test("uniquifySlug increments collisions", () => {
  const links = [{ id: "a", slug: "summer-launch" }, { id: "b", slug: "summer-launch-2" }];
  assert.equal(uniquifySlug("summer-launch", links), "summer-launch-3");
});

test("uniquifySlug ignores the current link during edits", () => {
  const links = [{ id: "a", slug: "summer-launch" }];
  assert.equal(uniquifySlug("summer-launch", links, "a"), "summer-launch");
});
