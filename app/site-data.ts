export const firmName = "Escritório de Advocacia | Carmem Testoni";
export const officePhone = "(47) 99771-1897";
export const officeWhatsapp = "5547997711897";
export const officeEmail = "carmen@carmemtestoni.com.br";
export const officeAddress =
  "Rua Jaraguá, 540 - América, Joinville - SC, 89204-650";
export const whatsappMessage =
  "Olá. Acessei o site da Carmem Testoni | Advogados Associados e gostaria de solicitar informações sobre o atendimento.";
export const whatsappUrl = `https://wa.me/${officeWhatsapp}?text=${encodeURIComponent(
  whatsappMessage,
)}`;

export const instagramUsername = "advocaciacarmemtestoni";
export const instagramProfileUrl =
  "https://www.instagram.com/advocaciacarmemtestoni/";
export const instagramFallbackBio =
  "Holding Familiar | Planejamento Tributário\nAjudamos famílias e empresários a protegerem o que construíram.";
export const instagramFeedUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_FEED_URL?.trim() ?? "";
