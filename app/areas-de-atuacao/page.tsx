/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  HeartHandshake,
  Landmark,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Áreas de atuação | Carmem Testoni",
  description:
    "Conheça a atuação do Escritório de Advocacia Carmem Testoni nas áreas patrimonial, sucessória, empresarial, tributária e familiar.",
};

const practiceAreas = [
  {
    title: "Planejamento patrimonial e sucessório",
    icon: ShieldCheck,
    text: "Estruturação jurídica voltada à organização, proteção e transmissão do patrimônio, considerando os objetivos da família e os aspectos sucessórios e tributários envolvidos.",
    items: [
      "Planejamento sucessório",
      "Holdings familiares",
      "Organização patrimonial",
      "Testamentos",
      "Doações",
      "Estruturação da sucessão familiar",
    ],
  },
  {
    title: "Empresarial",
    icon: BriefcaseBusiness,
    text: "Assessoria jurídica estratégica para empresas, empresários e famílias empresárias, com foco na prevenção de riscos e na segurança das relações comerciais.",
    items: [
      "Contratos empresariais",
      "Organização societária",
      "Consultoria preventiva",
      "Conflitos societários",
      "Governança familiar e empresarial",
    ],
  },
  {
    title: "Tributário",
    icon: Landmark,
    text: "Análise jurídica das obrigações tributárias e desenvolvimento de estratégias compatíveis com a legislação e com a realidade de cada cliente ou empresa.",
    items: [
      "Consultoria tributária",
      "Planejamento tributário",
      "Defesa administrativa",
      "Contencioso tributário",
      "Revisão de operações empresariais",
    ],
  },
  {
    title: "Direito das sucessões",
    icon: ScrollText,
    text: "Orientação jurídica em questões relacionadas à herança, inventário, partilha e transmissão de bens, buscando proporcionar organização e segurança às famílias.",
    items: [
      "Inventário judicial",
      "Inventário extrajudicial",
      "Partilha de bens",
      "Testamentos",
      "Orientação a herdeiros",
    ],
  },
  {
    title: "Direito de família",
    icon: HeartHandshake,
    text: "Atuação cuidadosa em questões familiares, considerando tanto os aspectos jurídicos quanto a sensibilidade das relações envolvidas.",
    items: [
      "Divórcio",
      "União estável",
      "Guarda",
      "Pensão alimentícia",
      "Partilha",
      "Planejamento matrimonial",
    ],
  },
];

export default function PracticeAreasPage() {
  return (
    <>
      <SiteHeader />

      <main id="conteudo" className="inner-page-main">
        <section className="inner-page-hero">
          <div className="section-inner inner-page-hero-content">
            <p className="eyebrow">Áreas de atuação</p>
            <h1>Assessoria jurídica estratégica e personalizada</h1>
            <p>
              Atuação preventiva, consultiva e contenciosa para famílias,
              patrimônios e empresas, de acordo com as necessidades de cada
              cliente.
            </p>
          </div>
        </section>

        <section className="section practice-section page-practice-section">
          <div className="section-inner">
            <div className="practice-grid">
              {practiceAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <article className="practice-card" key={area.title}>
                    <div className="card-icon">
                      <Icon aria-hidden="true" />
                    </div>
                    <h2>{area.title}</h2>
                    <p>{area.text}</p>
                    <ul>
                      {area.items.map((item) => (
                        <li key={item}>
                          <Check aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="enterprise-section" aria-labelledby="empresas-familiares">
          <div className="section-inner enterprise-grid">
            <div className="enterprise-media">
              <img
                src="/enterprise-meeting.webp"
                alt="Reunião profissional com análise de documentos"
                loading="lazy"
              />
            </div>

            <div className="enterprise-copy">
              <p className="eyebrow">Empresas familiares</p>
              <h2 id="empresas-familiares">
                Estratégia jurídica para empresas e famílias empresárias
              </h2>
              <p>
                A continuidade de uma empresa familiar depende de decisões bem
                estruturadas. A assessoria jurídica auxilia na organização
                societária, patrimonial e sucessória, contribuindo para a
                prevenção de conflitos e para a construção de regras claras
                entre familiares, sócios e sucessores.
              </p>
              <ul className="gold-list">
                <li>Organização societária e patrimonial</li>
                <li>Governança e continuidade empresarial</li>
                <li>Planejamento da sucessão familiar</li>
              </ul>
              <Link className="button button-champagne" href="/#contato">
                Solicitar atendimento
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
