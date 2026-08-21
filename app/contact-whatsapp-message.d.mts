export interface ContactWhatsappForm {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export declare const contactSubjects: readonly string[];
export declare const privacyNoticeLabel: string;
export declare const privacyConsentText: string;

export declare function buildContactWhatsappMessage(
  form: ContactWhatsappForm,
): string;
