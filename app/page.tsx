"use client";

/* eslint-disable @next/next/no-img-element */
import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  Building2,
  CalendarCheck,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import type { CSSProperties, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import {
  firmName,
  officeAddress,
  officeEmail,
  officePhone,
  officeWhatsapp,
  whatsappUrl,
} from "./site-data";

const temporaryImages = {
  hero: "/hero-office.webp",
  about: "/about-office.webp",
};

const values = [
  { label: "Estratégia", icon: BadgeCheck },
  { label: "Segurança jurídica", icon: ShieldCheck },
  { label: "Atendimento personalizado", icon: UserRoundCheck },
  { label: "Confidencialidade", icon: LockKeyhole },
];

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

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    revealElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
        element.classList.add("is-visible");
        return;
      }

      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const target = event.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    setForm((current) => ({
      ...current,
      [target.name]: value,
    }));
  }

  function validateForm() {
    const missingFields = [
      form.name,
      form.phone,
      form.email,
      form.subject,
      form.message,
    ].some((value) => value.trim().length === 0);

    if (missingFields || !form.privacy) {
      return "Preencha os campos obrigatórios e confirme o aviso de privacidade.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      return "Informe um e-mail válido para retorno do contato.";
    }

    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateForm();

    if (error) {
      setStatus("error");
      setFeedback(error);
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
            <div className="hero-copy" data-reveal>
              <p className="eyebrow">Escritório de Advocacia | Carmem Testoni</p>
              <h1>Proteção patrimonial e assessoria jurídica estratégica</h1>
              <p className="hero-lead">
                Soluções jurídicas personalizadas para famílias, patrimônios e
                empresas, conduzidas com estratégia, segurança e atenção às
                particularidades de cada cliente.
              </p>
              <div className="hero-actions" aria-label="Ações principais">
                <Link className="button button-primary" href="/areas-de-atuacao">
                  Conheça nossa atuação
                  <ArrowRight aria-hidden="true" />
                </Link>
                <a
                  className="button button-primary"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Entrar em contato
                </a>
              </div>
              <p className="hero-note">
                Atendimento presencial em Joinville e atendimento on-line.
              </p>
            </div>

          </div>
        </section>

        <section className="section about-section" id="escritorio">
          <div className="section-inner about-grid">
            <div className="section-copy" data-reveal>
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

            <div className="image-feature" data-reveal>
              <img
                src={temporaryImages.about}
                alt="Imagem temporária de ambiente corporativo com mesas de trabalho e luz natural"
                loading="lazy"
              />
            </div>
          </div>

          <div className="section-inner value-grid" aria-label="Valores do escritório">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div className="value-item" key={value.label} data-reveal>
                  <Icon aria-hidden="true" />
                  <span>{value.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section process-section" id="atendimento">
          <div className="section-inner">
            <div className="section-heading centered" data-reveal>
              <p className="eyebrow">Atendimento</p>
              <h2>Como funciona o atendimento</h2>
            </div>

            <div className="process-grid">
              {serviceSteps.map((step) => (
                <article className="process-step" key={step.step} data-reveal>
                  <span>{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contato">
          <div className="section-inner contact-heading" data-reveal>
            <p className="eyebrow">Contato</p>
            <h2>Entre em contato</h2>
            <p>
              Utilize um dos canais abaixo para solicitar informações ou agendar
              um atendimento.
            </p>
          </div>

          <div className="section-inner contact-grid">
            <div className="contact-details" data-reveal>
              <h3>{firmName}</h3>
              <address>
                <p>
                  <Phone aria-hidden="true" />
                  <span>
                    <strong>Telefone e WhatsApp</strong>
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
                  <Building2 aria-hidden="true" />
                  <span>
                    <strong>Cidade</strong>
                    Joinville - Santa Catarina
                  </span>
                </p>
                <p>
                  <CalendarCheck aria-hidden="true" />
                  <span>
                    <strong>Horário</strong>
                    [CONFIRMAR HORÁRIO DE ATENDIMENTO]
                  </span>
                </p>
                <p>
                  <AtSign aria-hidden="true" />
                  <span>
                    <strong>Instagram</strong>
                    [INSERIR LINK OFICIAL]
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

            <form className="contact-form" onSubmit={handleSubmit} noValidate data-reveal>
              <div className="form-row">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleFieldChange}
                  required
                />
              </div>

              <div className="form-row two-columns">
                <div>
                  <label htmlFor="phone">Telefone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleFieldChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleFieldChange}
                    required
                  />
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
                  required
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
      </main>

      <SiteFooter />
    </>
  );
}
