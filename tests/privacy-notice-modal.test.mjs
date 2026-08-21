import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const normalizeWhitespace = (value) => value.replace(/\s+/g, " ").trim();

test("opens an accessible privacy dialog from the underlined consent text", async () => {
  const [page, modal, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/privacy-notice-modal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /privacyConsentText\.split\(privacyNoticeLabel\)/);
  assert.match(page, /className="privacy-notice-trigger"/);
  assert.match(page, /aria-controls="privacy-notice-dialog"/);
  assert.match(page, /onClick=\{\(\) => setIsPrivacyModalOpen\(true\)\}/);
  assert.match(styles, /\.privacy-notice-trigger\s*\{[^}]*text-decoration:\s*underline;/s);

  assert.match(modal, /<dialog/);
  assert.match(modal, /id="privacy-notice-dialog"/);
  assert.match(modal, /aria-labelledby="privacy-modal-title"/);
  assert.match(modal, /dialog\?\.showModal\(\)/);
  assert.match(modal, /onCancel=/);
  assert.match(modal, /closeButtonRef\.current\?\.focus\(\)/);
  assert.equal(modal.match(/<button/g)?.length, 1);
  assert.match(modal, /aria-label="Fechar aviso de privacidade"/);
  assert.match(styles, /\.privacy-modal\s*\{[^}]*background:\s*var\(--champagne-light\);/s);
  assert.match(styles, /\.privacy-modal-close\s*\{[^}]*right:\s*18px;/s);
  assert.match(styles, /\.privacy-modal-close\s*\{[^}]*border:\s*0;[^}]*background:\s*transparent;/s);
  assert.doesNotMatch(styles, /\.privacy-modal-close\s*\{[^}]*border-radius:/s);
  assert.doesNotMatch(styles, /\.privacy-modal-content\s*\{[^}]*border-top:/s);
});

test("locks background scrolling without moving or restoring the page position", async () => {
  const modal = await readFile(
    new URL("../app/components/privacy-notice-modal.tsx", import.meta.url),
    "utf8",
  );

  assert.match(modal, /documentElement\.style\.overflow = "hidden"/);
  assert.match(modal, /documentElement\.style\.overscrollBehavior = "none"/);
  assert.match(modal, /body\.style\.overflow = "hidden"/);
  assert.match(modal, /body\.style\.overscrollBehavior = "none"/);
  assert.match(modal, /previousScrollStyles\.documentOverflow/);
  assert.match(modal, /previousScrollStyles\.bodyOverflow/);
  assert.doesNotMatch(modal, /body\.style\.position = "fixed"/);
  assert.doesNotMatch(modal, /window\.scrollTo/);
});

test("keeps the requested privacy notice content and contact email", async () => {
  const modal = normalizeWhitespace(
    await readFile(new URL("../app/components/privacy-notice-modal.tsx", import.meta.url), "utf8"),
  );

  assert.match(modal, /Ao preencher este formulário, você nos fornece: nome e número de WhatsApp \(e, opcionalmente, mensagem\)\./);
  assert.match(modal, /<strong>Finalidade:<\/strong> utilizamos esses dados exclusivamente para retornar seu contato via WhatsApp e responder à sua solicitação\./);
  assert.match(modal, /<strong>Seus direitos:<\/strong> você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, entrando em contato pelo e-mail\{" "\} <a href="mailto:contato@carmemtestoni\.com"> contato@carmemtestoni\.com <\/a> \./);
});
