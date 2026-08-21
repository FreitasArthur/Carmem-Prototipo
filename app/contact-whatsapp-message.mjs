export const contactSubjects = Object.freeze([
  "Sucessões e Planejamento patrimonial",
  "Tributário, Societário e Empresarial",
  "Trabalhista",
  "Imobiliário",
  "Cível e Consumidor",
  "Família",
  "Outro assunto",
]);

export const privacyNoticeLabel = "Aviso de Privacidade";
export const privacyConsentText =
  `Li e concordo com o ${privacyNoticeLabel}, que explica como meus dados serão utilizados para o retorno do contato.`;

export function buildContactWhatsappMessage(form) {
  return [
    "Olá. Acessei o site da Carmem Testoni | Advogados Associados e gostaria de solicitar informações sobre o atendimento.",
    "",
    `Nome: ${form.name}`,
    `Telefone: ${form.phone}`,
    `E-mail: ${form.email}`,
    `Assunto: ${form.subject}`,
    "",
    `Mensagem: ${form.message}`,
    "",
    privacyConsentText,
  ].join("\n");
}
