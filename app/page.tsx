"use client";

/* eslint-disable @next/next/no-img-element */
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck,
  FileText,
  HeartHandshake,
  Landmark,
  Mail,
  MapPin,
  Phone,
  ScrollText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { CSSProperties, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useState } from "react";
import {
  contactFields,
  formatBrazilianPhone,
  sanitizeName,
  validateContactField,
} from "./contact-form-validation.mjs";
import type { ContactField } from "./contact-form-validation.mjs";
import { InstagramProfile } from "./components/instagram-profile";
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
    text: "O cliente apresenta brevemente sua necessidade e solicita o agendamento.",
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

const practiceAreas = [
  {
    title: "Planejamento patrimonial e sucessório",
    icon: ShieldCheck,
    slug: "planejamento-patrimonial-e-sucessorio",
    text: "Estruturação jurídica voltada à organização, proteção e transmissão do patrimônio, considerando os objetivos da família e os aspectos sucessórios e tributários envolvidos.",
  },
  {
    title: "Empresarial",
    icon: BriefcaseBusiness,
    slug: "empresarial",
    text: "Assessoria jurídica estratégica para empresas, empresários e famílias empresárias, com foco na prevenção de riscos e na segurança das relações comerciais.",
  },
  {
    title: "Tributário",
    icon: Landmark,
    slug: "tributario",
    text: "Análise jurídica das obrigações tributárias e desenvolvimento de estratégias compatíveis com a legislação e com a realidade de cada cliente ou empresa.",
  },
  {
    title: "Direito das sucessões",
    icon: ScrollText,
    slug: "direito-das-sucessoes",
    text: "Orientação jurídica em questões relacionadas à herança, inventário, partilha e transmissão de bens, buscando proporcionar organização e segurança às famílias.",
  },
  {
    title: "Direito de família",
    icon: HeartHandshake,
    slug: "direito-de-familia",
    text: "Atuação cuidadosa em questões familiares, considerando tanto os aspectos jurídicos quanto a sensibilidade das relações envolvidas.",
  },
];

const differentiators = [
  {
    title: "Análise individualizada",
    icon: FileText,
    text: "Cada situação é avaliada de acordo com suas particularidades, objetivos e possíveis impactos jurídicos.",
  },
  {
    title: "Atuação preventiva",
    icon: ShieldCheck,
    text: "O trabalho preventivo permite identificar riscos e estruturar decisões com maior segurança.",
  },
  {
    title: "Visão integrada",
    icon: UsersRound,
    text: "As questões familiares, patrimoniais, empresariais e tributárias são analisadas de forma conjunta quando necessário.",
  },
  {
    title: "Atendimento presencial e on-line",
    icon: CalendarCheck,
    text: "O escritório realiza atendimentos presenciais em Joinville e também oferece atendimento por meios digitais.",
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

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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

    const message = [
      "Olá. Acessei o site da Carmem Testoni | Advogados Associados e gostaria de solicitar informações sobre o atendimento.",
      "",
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      `E-mail: ${form.email}`,
      `Assunto: ${form.subject}`,
      "",
      `Mensagem: ${form.message}`,
      "",
      "Declaro que li o aviso de privacidade e autorizo o uso dos dados enviados exclusivamente para retorno do contato.",
    ].join("\n");

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
              <h1>Proteção patrimonial e assessoria jurídica estratégica</h1>
              <p className="hero-lead">
                Soluções jurídicas personalizadas para famílias, patrimônios e
                empresas, conduzidas com estratégia, segurança e atenção às
                particularidades de cada cliente.
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
              <h2>Assessoria jurídica com visão estratégica</h2>
              <p>
                A Carmem Testoni | Advogados Associados atua na proteção do
                patrimônio, na organização das relações familiares e sucessórias
                e na assessoria estratégica de empresas e famílias empresárias.
              </p>
              <p>
                Cada situação é analisada individualmente, considerando seus
                aspectos jurídicos, patrimoniais, tributários, empresariais e
                familiares. O trabalho é pautado pela ética, transparência,
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
                Atuação preventiva, consultiva e contenciosa para famílias,
                patrimônios e empresas, de acordo com as necessidades de cada
                cliente.
              </p>
            </div>

            <div className="practice-grid">
              {practiceAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <article className="practice-card" key={area.title}>
                    <div className="card-icon">
                      <Icon aria-hidden="true" />
                    </div>
                    <h3>{area.title}</h3>
                    <p>{area.text}</p>
                    <Link
                      className="practice-card-link"
                      href={`/areas-de-atuacao/${area.slug}`}
                    >
                      Saiba mais
                    </Link>
                  </article>
                );
              })}
            </div>
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
                  <option value="Planejamento patrimonial e sucessório">
                    Planejamento patrimonial e sucessório
                  </option>
                  <option value="Direito empresarial">Direito empresarial</option>
                  <option value="Direito tributário">Direito tributário</option>
                  <option value="Direito das sucessões">Direito das sucessões</option>
                  <option value="Direito de família">Direito de família</option>
                  <option value="Outro assunto">Outro assunto</option>
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

              <label className="privacy-check">
                <input
                  name="privacy"
                  type="checkbox"
                  checked={form.privacy}
                  onChange={handleFieldChange}
                  required
                />
                <span>
                  Declaro que li o aviso de privacidade e autorizo o uso dos
                  dados enviados exclusivamente para retorno do contato.
                </span>
              </label>

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

      <SiteFooter />
    </>
  );
}
