import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders a dynamic Instagram profile with exactly four recent posts", async () => {
  const [component, siteData] = await Promise.all([
    readFile(new URL("../app/components/instagram-profile.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(component, /value\.posts\.filter\(isInstagramPost\)\.slice\(0, 4\)/);
  assert.match(component, /profilePictureUrl/);
  assert.match(component, /biography/);
  assert.match(component, />\s*Seguir\s*</);
  assert.doesNotMatch(component, /followersCount|followsCount|mediaCount/);
  assert.match(siteData, /advocaciacarmemtestoni/);
  assert.match(siteData, /https:\/\/feeds\.behold\.so\/syriXUuQgTy4cXFuBtIu/);
  assert.match(siteData, /NEXT_PUBLIC_INSTAGRAM_FEED_URL/);
});

test("keeps Instagram credentials out of the public site configuration", async () => {
  const envExample = await readFile(new URL("../.env.example", import.meta.url), "utf8");

  assert.match(envExample, /NEXT_PUBLIC_INSTAGRAM_FEED_URL=/);
  assert.doesNotMatch(envExample, /access[_-]?token|password|secret/i);
});
