import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  formatBrazilianPhone,
  isPlausibleEmail,
  sanitizeName,
  validateContactField,
} from "../app/contact-form-validation.mjs";

test("keeps only letters and spaces in names, including accented letters", () => {
  assert.equal(sanitizeName("  João da Silva 123!"), "João da Silva ");
  assert.equal(sanitizeName("MARIA clara"), "MARIA clara");
  assert.equal(sanitizeName("ÁÉÍÓÚ çãõ ÜBER"), "ÁÉÍÓÚ çãõ ÜBER");
  assert.equal(sanitizeName("Ana\tMaria\nSouza"), "AnaMariaSouza");
  assert.equal(sanitizeName("José   Carlos"), "José Carlos");
});

test("formats Brazilian mobile phones progressively and ignores non-digits", () => {
  assert.equal(formatBrazilianPhone("4"), "(4");
  assert.equal(formatBrazilianPhone("47"), "(47");
  assert.equal(formatBrazilianPhone("4799734"), "(47) 99734");
  assert.equal(formatBrazilianPhone("(47) abc 99734-2205"), "(47) 99734-2205");
  assert.equal(formatBrazilianPhone("47997342205999"), "(47) 99734-2205");
  assert.equal(formatBrazilianPhone("4799734220"), "(47) 99734-220");
  assert.equal(formatBrazilianPhone(""), "");
});

test("validates required fields, complete phones, and permissive email formats", () => {
  assert.equal(validateContactField("name", ""), "Este campo é obrigatório.");
  assert.equal(
    validateContactField("phone", "(47) 9973-4220"),
    "Informe DDD + 9 números.",
  );
  assert.equal(validateContactField("phone", "(47) 99734-2205"), "");
  assert.equal(isPlausibleEmail("Cliente123+site@Exemplo.com.br"), true);
  assert.equal(isPlausibleEmail("nome.sobrenome_2@sub-dominio.exemplo.com.br"), true);
  assert.equal(isPlausibleEmail("cliente@exemplo"), false);
  assert.equal(isPlausibleEmail("cliente @exemplo.com"), false);
  assert.equal(isPlausibleEmail("@exemplo.com"), false);
  assert.equal(isPlausibleEmail("cliente@@exemplo.com"), false);
  assert.equal(isPlausibleEmail("cliente@.com"), false);
  assert.equal(isPlausibleEmail("cliente@exemplo.com."), false);
  assert.equal(validateContactField("email", ""), "Este campo é obrigatório.");
  assert.equal(validateContactField("email", "cliente@exemplo"), "Informe um e-mail válido.");
});

test("keeps the message optional, fixed in size, and scrollable", async () => {
  const [page, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const messageField = page.match(/<textarea[\s\S]*?id="message"[\s\S]*?\/>/)?.[0];

  assert.match(page, /aria-describedby=\{fieldErrors\.name/);
  assert.match(page, /aria-describedby=\{fieldErrors\.phone/);
  assert.match(page, /aria-describedby=\{fieldErrors\.email/);
  assert.ok(messageField);
  assert.match(messageField, /onChange=\{handleFieldChange\}/);
  assert.doesNotMatch(messageField, /required/);
  assert.match(
    styles,
    /textarea\s*\{[^}]*min-height:\s*112px;[^}]*overflow-y:\s*auto;[^}]*resize:\s*none;/s,
  );
  assert.doesNotMatch(styles, /textarea\s*\{[^}]*resize:\s*(?:vertical|both|block)/s);
});

test("keeps validation messages out of the form layout flow", async () => {
  const [page, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /className="form-row validated-field"/);
  assert.equal(page.match(/className="validated-field"/g)?.length, 2);
  assert.match(
    styles,
    /\.validated-field\s*\{[^}]*position:\s*relative;[^}]*align-content:\s*start;/s,
  );
  assert.match(
    styles,
    /\.field-error\s*\{[^}]*position:\s*absolute;[^}]*top:\s*100%;[^}]*white-space:\s*nowrap;/s,
  );
  assert.match(styles, /\.contact-form\s*\{[^}]*gap:\s*24px;/s);
  assert.match(styles, /\.two-columns\s*\{[^}]*row-gap:\s*24px;/s);
  assert.match(
    styles,
    /@media \(max-width:\s*640px\)[\s\S]*?\.two-columns\s*\{[^}]*grid-template-columns:\s*1fr;/s,
  );
});

test("limits privacy consent clicks to the checkbox itself", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const privacyControl = page.match(
    /<div className="privacy-check">[\s\S]*?<\/div>/,
  )?.[0];

  assert.ok(privacyControl);
  assert.match(privacyControl, /id="privacy-consent"/);
  assert.match(privacyControl, /aria-labelledby="privacy-consent-text"/);
  assert.match(privacyControl, /<span id="privacy-consent-text">/);
  assert.doesNotMatch(privacyControl, /<label|htmlFor=/);
});
