import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  assertExpectedWhatsappNumber,
  verifyWhatsappIntegrity,
  verifyWhatsappLinks,
} from "../scripts/verify-whatsapp.mjs";

const projectRootUrl = new URL("../", import.meta.url);

test("locks the configured WhatsApp to the official number", async () => {
  const verifiedLinkCount = await verifyWhatsappIntegrity({
    projectRoot: fileURLToPath(projectRootUrl),
    outputDirectory: fileURLToPath(new URL("../out/", import.meta.url)),
  });

  assert.ok(verifiedLinkCount > 0);
});

test("controlled tampering simulation rejects another WhatsApp number", () => {
  const maliciousNumber = "5511999999999";

  assert.throws(
    () => assertExpectedWhatsappNumber(maliciousNumber, "simulacao controlada"),
    /WhatsApp nao autorizado/,
  );
  assert.throws(
    () => verifyWhatsappLinks(`https://wa.me/${maliciousNumber}`, "simulacao controlada"),
    /WhatsApp nao autorizado/,
  );
});

test("keeps the required Cloudflare security headers enabled", async () => {
  const cloudflareHeaders = await readFile(
    new URL("../public/_headers", import.meta.url),
    "utf8",
  );
  const requiredDirectives = [
    "/*",
    "/_next/static/*",
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "https://feeds.behold.so",
    "https://*.behold.pictures",
  ];

  for (const directive of requiredDirectives) {
    assert.ok(cloudflareHeaders.includes(directive), `${directive} ausente.`);
  }
});

test("publishes the security contact at the standardized path", async () => {
  const sourceSecurityTxt = await readFile(
    new URL("../public/.well-known/security.txt", import.meta.url),
    "utf8",
  );
  const exportedSecurityTxt = await readFile(
    new URL("../out/.well-known/security.txt", import.meta.url),
    "utf8",
  );
  const exportedHeaders = await readFile(
    new URL("../out/_headers", import.meta.url),
    "utf8",
  );

  for (const field of ["Contact:", "Expires:", "Preferred-Languages:", "Canonical:"]) {
    assert.ok(sourceSecurityTxt.includes(field), `${field} ausente.`);
  }

  assert.equal(exportedSecurityTxt, sourceSecurityTxt);
  assert.ok(exportedHeaders.includes("Content-Security-Policy"));
});
