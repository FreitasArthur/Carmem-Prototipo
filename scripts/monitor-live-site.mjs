import { expectedWhatsappNumber, verifyWhatsappLinks } from "./verify-whatsapp.mjs";

const siteUrl = process.env.MONITOR_SITE_URL;

if (!siteUrl) {
  console.error(
    "Defina MONITOR_SITE_URL quando o dominio publico estiver disponivel.",
  );
  process.exit(2);
}

const requiredHeaders = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
];

try {
  const response = await fetch(siteUrl, {
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`O site respondeu com HTTP ${response.status}.`);
  }

  if (new URL(response.url).protocol !== "https:") {
    throw new Error("O endereco final nao usa HTTPS.");
  }

  const html = await response.text();
  const linkCount = verifyWhatsappLinks(html, response.url);
  if (linkCount === 0) {
    throw new Error("Nenhum link oficial do WhatsApp foi encontrado no HTML.");
  }

  const missingHeaders = requiredHeaders.filter(
    (headerName) => !response.headers.has(headerName),
  );
  if (missingHeaders.length > 0) {
    throw new Error(
      `Headers de seguranca ausentes: ${missingHeaders.join(", ")}.`,
    );
  }

  console.log(
    `Monitor aprovado: ${response.url}, WhatsApp ${expectedWhatsappNumber}, ${linkCount} link(s).`,
  );
} catch (error) {
  console.error(`ALERTA DE SEGURANCA: ${error.message}`);
  process.exitCode = 1;
}
