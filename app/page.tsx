"use client";

/* eslint-disable @next/next/no-img-element */
import {
  ArrowRight,
  CalendarCheck,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { CSSProperties, ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import {
  contactFields,
  formatBrazilianPhone,
  sanitizeName,
  validateContactField,
} from "./contact-form-validation.mjs";
import type { ContactField } from "./contact-form-validation.mjs";
import {
  buildContactWhatsappMessage,
  contactSubjects,
  privacyConsentText,
  privacyNoticeLabel,
} from "./contact-whatsapp-message.mjs";
import { InstagramProfile } from "./components/instagram-profile";
import { PracticeAreasCarousel } from "./components/practice-areas-carousel";
import { PrivacyNoticeModal } from "./components/privacy-notice-modal";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { WhatsappIcon } from "./components/whatsapp-icon";
import {
  firmName,
  officeAddress,
  officeEmail,
  officePhone,
  officeWhatsapp,
  whatsappUrl,
} from "./site-data";

const temporaryImages = {
  hero: "/hero-office-green.webp",
  about: "/office-of.jpeg",
};

const serviceSteps = [
  {
    step: "01",
    title: "Contato inicial",
    text: "O cliente apresenta sua necessidade e solicita o agendamento do atendimento inicial.",
  },
  {
    step: "02",
    title: "Reunião de atendimento",
    text: "O caso é compreendido de maneira reservada, com espaço para esclarecimento das principais dúvidas.",
  },
  {
    step: "03",
    title: "Análise jurídica",
    text: "As informações e documentos são avaliados para definição das possibilidades jurídicas aplicáveis.",
  },
  {
    step: "04",
    title: "Orientação e estratégia",
    text: "O escritório apresenta as orientações e os próximos passos adequados à situação analisada.",
  },
];

const differentiators = [
  {
    title: "Análise individualizada",
    icon: FileText,
    text: "Nenhuma solução pronta. Cada caso é estudado a fundo, considerando particularidades, objetivos e riscos jurídicos que só uma análise dedicada revela.",
  },
  {
    title: "Atuação preventiva",
    icon: ShieldCheck,
    text: "Agir antes do problema custa menos e protege mais. Identificamos riscos e estruturamos decisões com segurança, evitando conflitos e prejuízos futuros.",
  },
  {
    title: "Visão integrada",
    icon: UsersRound,
    text: "Direito de família, patrimônio, empresa e tributos raramente andam separados. Analisamos tudo em conjunto para que nenhuma decisão comprometa outra área da sua vida ou do seu negócio.",
  },
  {
    title: "Atendimento próximo e acessível",
    icon: CalendarCheck,
    text: "Presencial em Joinville ou on-line, o cliente tem acesso direto ao escritório, com linguagem clara e disponibilidade real — não apenas formalidade.",
  },
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
  privacy: false,
};

type FormState = typeof initialForm;
type FormStatus = "idle" | "error" | "success";
type FieldErrors = Partial<Record<ContactField, string>>;

const [privacyConsentPrefix, privacyConsentSuffix] =
  privacyConsentText.split(privacyNoticeLabel);

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  function updateFieldError(field: ContactField, value: string, onlyIfVisible = false) {
    setFieldErrors((current) => {
      if (onlyIfVisible && !(field in current)) return current;

      const next = { ...current };
      const error = validateContactField(field, value);

      if (error) next[field] = error;
      else delete next[field];

      return next;
    });
  }

  function updateContactField(field: ContactField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    updateFieldError(field, value, true);
    setStatus("idle");
    setFeedback("");
  }

  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const target = event.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    if (target.name === "name") {
      updateContactField("name", sanitizeName(String(value)));
      return;
    }

    if (target.name === "phone") {
      updateContactField("phone", formatBrazilianPhone(String(value)));
      return;
    }

    if (target.name === "email") {
      updateContactField("email", String(value));
      return;
    }

    setForm((current) => ({
      ...current,
      [target.name]: value,
    }));
    setStatus("idle");
    setFeedback("");
  }

  function validateForm() {
    const errors = contactFields.reduce<FieldErrors>((current, field) => {
      const error = validateContactField(field, form[field]);
      if (error) current[field] = error;
      return current;
    }, {});
    const subjectMissing = form.subject.trim().length === 0;
    let generalFeedback = "";

    if (subjectMissing && !form.privacy) {
      generalFeedback = "Selecione um assunto e confirme o aviso de privacidade.";
    } else if (subjectMissing) {
      generalFeedback = "Selecione um assunto para continuar.";
    } else if (!form.privacy) {
      generalFeedback = "Confirme o aviso de privacidade para continuar.";
    }

    return {
      errors,
      generalFeedback,
      hasError: Object.keys(errors).length > 0 || Boolean(generalFeedback),
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateForm();

    if (validation.hasError) {
      setFieldErrors(validation.errors);
      setStatus("error");
      setFeedback(validation.generalFeedback);
      return;
    }

    const message = buildContactWhatsappMessage(form);

    setStatus("success");
    setFeedback("Mensagem validada. O WhatsApp será aberto para concluir o envio.");
    window.location.href = `https://wa.me/${officeWhatsapp}?text=${encodeURIComponent(
      message,
    )}`;
  }

  return (
    <>
      <SiteHeader />

      <main id="conteudo">
        <section
          className="hero"
          id="inicio"
          style={{ "--hero-image": `url(${temporaryImages.hero})` } as CSSProperties}
        >
          <div className="hero-overlay" />
          <div className="section-inner hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Escritório de Advocacia | Carmem Testoni</p>
              <h1>O que você construiu merece a proteção jurídica certa</h1>
              <p className="hero-lead">
                Soluções personalizadas em patrimônio, empresas e família, com a estratégia e a discrição que cada situação exige.
              </p>
              <div className="hero-actions" aria-label="Ação principal">
                <a
                  className="button hero-contact-button"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Entrar em contato
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>

          </div>
        </section>

        <section className="section about-section" id="escritorio">
          <div className="section-inner about-grid">
            <div className="section-copy">
              <p className="eyebrow">O escritório</p>
              <h2>Mais que assessoria, uma parceria de confiança</h2>
              <p>
                Atuamos na proteção do patrimônio, na organização das relações familiares e sucessórias e no apoio jurídico 
                estratégico a empresas e famílias empresárias — sempre com a atenção que cada história merece.
              </p>
              <p>
                Cada situação é analisada individualmente, considerando seus 
                aspectos jurídicos, patrimoniais, tributários, empresariais e familiares. O trabalho é pautado pela ética, transparência, 
                discrição e comunicação clara.
              </p>
            </div>

            <div className="image-feature">
              <img
                src={temporaryImages.about}
                alt="Recepção oficial do escritório Carmem Testoni Advogados Associados"
                width="1280"
                height="881"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="section process-section" id="atendimento">
          <div className="section-inner">
            <div className="section-heading centered">
              <p className="eyebrow">Atendimento</p>
              <h2>Como funciona o atendimento</h2>
            </div>

            <div className="process-grid">
              {serviceSteps.map((step, index) => (
                <article className="process-step" key={step.step}>
                  <span>{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  {index === 0 ? (
                    <a
                      className="social-link process-whatsapp-link"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Iniciar contato pelo WhatsApp"
                      title="Iniciar contato pelo WhatsApp"
                    >
                      <WhatsappIcon />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section practice-section home-practice-section"
          id="areas-de-atuacao"
        >
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">Áreas de atuação</p>
              <h2>Assessoria jurídica estratégica e personalizada</h2>
              <p>
                Atuação preventiva, consultiva e contenciosa em diversas áreas do Direito, de acordo 
                com as necessidades de cada cliente.

              </p>
            </div>

            <PracticeAreasCarousel />
          </div>
        </section>

        <section
          className="section about-differentials-section home-differentials-section"
          id="diferenciais"
        >
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">Diferenciais</p>
              <h2>Uma atuação próxima, técnica e personalizada</h2>
            </div>

            <div className="differentials-grid">
              {differentiators.map((item) => {
                const Icon = item.icon;
                return (
                  <article className="differential-item" key={item.title}>
                    <Icon aria-hidden="true" />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contato">
          <div className="section-inner contact-heading">
            <p className="eyebrow">Contato</p>
            <h2>Entre em contato</h2>
            <p>
              Utilize um dos canais abaixo para solicitar informações ou agendar
              um atendimento.
            </p>
          </div>

          <div className="section-inner contact-grid">
            <div className="contact-details">
              <h3>{firmName}</h3>
              <address>
                <p>
                  <Phone aria-hidden="true" />
                  <span>
                    <strong>WhatsApp</strong>
                    {officePhone}
                  </span>
                </p>
                <p>
                  <MapPin aria-hidden="true" />
                  <span>
                    <strong>Endereço</strong>
                    {officeAddress}
                  </span>
                </p>

                <p>
                  <Mail aria-hidden="true" />
                  <span>
                    <strong>E-mail</strong>
                    {officeEmail}
                  </span>
                </p>
              </address>

              <iframe
                className="map-frame"
                title="Mapa da localização em Joinville"
                src="https://www.google.com/maps?q=Carmem%20Testoni%20Advogados%20Associados%20Joinville%20SC&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row validated-field">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleFieldChange}
                  onBlur={() => updateFieldError("name", form.name)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  required
                />
                {fieldErrors.name ? (
                  <p className="field-error" id="name-error" role="alert">
                    {fieldErrors.name}
                  </p>
                ) : null}
              </div>

              <div className="form-row two-columns">
                <div className="validated-field">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleFieldChange}
                    onBlur={() => updateFieldError("phone", form.phone)}
                    maxLength={15}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                    required
                  />
                  {fieldErrors.phone ? (
                    <p className="field-error" id="phone-error" role="alert">
                      {fieldErrors.phone}
                    </p>
                  ) : null}
                </div>
                <div className="validated-field">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleFieldChange}
                    onBlur={() => updateFieldError("email", form.email)}
                    spellCheck={false}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    required
                  />
                  {fieldErrors.email ? (
                    <p className="field-error" id="email-error" role="alert">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="subject">Assunto</label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleFieldChange}
                  required
                >
                  <option value="">Selecione</option>
                  {contactSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="privacy-check">
                <input
                  id="privacy-consent"
                  name="privacy"
                  type="checkbox"
                  checked={form.privacy}
                  onChange={handleFieldChange}
                  aria-labelledby="privacy-consent-text"
                  required
                />
                <span id="privacy-consent-text">
                  {privacyConsentPrefix}
                  <button
                    className="privacy-notice-trigger"
                    type="button"
                    aria-controls="privacy-notice-dialog"
                    aria-haspopup="dialog"
                    onClick={() => setIsPrivacyModalOpen(true)}
                  >
                    {privacyNoticeLabel}
                  </button>
                  {privacyConsentSuffix}
                </span>
              </div>

              <button className="button button-primary form-submit" type="submit">
                Enviar mensagem
                <ArrowRight aria-hidden="true" />
              </button>

              <p
                className={`form-feedback ${
                  status === "error" ? "is-error" : status === "success" ? "is-success" : ""
                }`}
                aria-live="polite"
              >
                {feedback}
              </p>
            </form>
          </div>
        </section>

        <InstagramProfile />
      </main>

      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <SiteFooter />
    </>
  );
}
