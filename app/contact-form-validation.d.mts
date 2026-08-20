export type ContactField = "name" | "phone" | "email";

export const contactFields: ContactField[];
export function sanitizeName(value: string): string;
export function formatBrazilianPhone(value: string): string;
export function isPlausibleEmail(value: string): boolean;
export function validateContactField(field: ContactField, value: string): string;
