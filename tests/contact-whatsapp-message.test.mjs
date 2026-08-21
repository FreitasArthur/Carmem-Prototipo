import assert from "node:assert/strict";
import test from "node:test";

import {
  buildContactWhatsappMessage,
  contactSubjects,
  privacyConsentText,
} from "../app/contact-whatsapp-message.mjs";

const expectedPrivacyConsent =
  "Li e concordo com o Aviso de Privacidade, que explica como meus dados serão utilizados para o retorno do contato.";

const expectedSubjects = [
  "Sucessões e Planejamento patrimonial",
  "Tributário, Societário e Empresarial",
  "Trabalhista",
  "Imobiliário",
  "Cível e Consumidor",
  "Família",
  "Outro assunto",
];

test("keeps the current contact subjects in the displayed order", () => {
  assert.deepEqual([...contactSubjects], expectedSubjects);
});

test("writes every selected subject unchanged after the WhatsApp Assunto label", () => {
  for (const subject of contactSubjects) {
    const message = buildContactWhatsappMessage({
      name: "Arthur Teste",
      phone: "(47) 99771-1897",
      email: "arthur@example.com",
      subject,
      message: "Gostaria de mais informações.",
    });

    assert.equal(
      message.split("\n").find((line) => line.startsWith("Assunto:")),
      `Assunto: ${subject}`,
    );
    assert.equal(message.split("\n").at(-1), expectedPrivacyConsent);
    assert.doesNotMatch(message, /Declaro que li o aviso de privacidade/);
  }
});

test("shares the updated privacy consent with the WhatsApp message", () => {
  assert.equal(privacyConsentText, expectedPrivacyConsent);
});
