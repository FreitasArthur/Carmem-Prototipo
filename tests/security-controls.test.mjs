import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  assertExpectedWhatsappNumber,
  verifyWhatsappIntegrity,
  verifyWhatsappLinks,
} from "../scripts/verify-whatsapp.mjs";

const projectRootUrl = new URL("../", import.meta.url);
const expectedFormHash =
  "97805bdb0798c911aff63bc64aa72b5b0830109fec8a8205f43d00056a6f5811";

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

test("keeps the contact form byte-for-byte unchanged", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const formStart = page.indexOf('<form className="contact-form"');
  const formEnd = page.indexOf("</form>", formStart) + "</form>".length;

  assert.ok(formStart >= 0 && formEnd > formStart, "Formulario nao localizado.");

  const formHash = createHash("sha256")
    .update(page.slice(formStart, formEnd))
    .digest("hex");

  assert.equal(formHash, expectedFormHash);
});

test("keeps the required Netlify security headers enabled", async () => {
  const netlifyConfig = await readFile(
    new URL("../netlify.toml", import.meta.url),
    "utf8",
  );
  const requiredDirectives = [
    'publish = "out"',
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
  ];

  for (const directive of requiredDirectives) {
    assert.ok(netlifyConfig.includes(directive), `${directive} ausente.`);
  }
});
