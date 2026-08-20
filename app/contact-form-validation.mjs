export const contactFields = ["name", "phone", "email"];

export function sanitizeName(value) {
  return value
    .replace(/[^\p{L} ]/gu, "")
    .replace(/ +/g, " ")
    .replace(/^ /, "");
}

export function formatBrazilianPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length < 3) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const firstPart = digits.slice(2, 7);
  const lastPart = digits.slice(7);

  return `(${areaCode}) ${firstPart}${lastPart ? `-${lastPart}` : ""}`;
}

export function isPlausibleEmail(value) {
  const email = value.trim();
  const parts = email.split("@");

  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  return (
    localPart.length > 0 &&
    domain.length > 0 &&
    !/\s/.test(email) &&
    domain.includes(".") &&
    !domain.startsWith(".") &&
    !domain.endsWith(".")
  );
}

export function validateContactField(field, value) {
  if (value.trim().length === 0) {
    return "Este campo é obrigatório.";
  }

  if (field === "phone" && value.replace(/\D/g, "").length !== 11) {
    return "Informe DDD + 9 números.";
  }

  if (field === "email" && !isPlausibleEmail(value)) {
    return "Informe um e-mail válido.";
  }

  return "";
}
