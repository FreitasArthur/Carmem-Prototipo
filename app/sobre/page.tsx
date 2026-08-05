import type { Metadata } from "next";
import {
  CalendarCheck,
  FileText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Sobre o escritório | Carmem Testoni",
  description:
    "Conheça a história, a filosofia, os diferenciais e a equipe do Escritório de Advocacia Carmem Testoni.",
};

const teamMembers = [
  {
    name: "Carmem Testoni",
    role: "Sócia-fundadora",
    initials: "CT",
    description:
      "Sócia Fundadora do escritório Carmem Testoni Advogados Associados, uma referência em Direito das Sucessões, Empresarial, Tributário e Familiar. Carmem é graduada em Direito pela Faculdade Cenecista de Joinville e possui Pós-Graduação em Direito Processual Civil e em Direito de Família e Sucessões, ambas pelo Instituto Damásio de Direito. Com vasta experiência nas áreas de Sucessões e Familiar, Carmem atua principalmente de forma preventiva, focando na proteção patrimonial de seus clientes. Especialista na elaboração de Planejamentos Sucessórios e Matrimoniais, ela sempre prioriza os desejos de seus clientes, garantindo conformidade com a legislação, economia tributária e segurança nas transações envolvidas. Além de sua atuação em questões judiciais no âmbito familiar, Carmem também assessora outros departamentos do escritório nas áreas de Direito Empresarial e Tributário, em colaboração com o especialista Dr. Paulo.",
  },
  {
    name: "Paulo Roberto Santos da Silveira",
    role: "Advogado associado",
    initials: "PS",
    description:
      "Paulo Roberto Santos da Silveira é o primeiro advogado associado do escritório Carmem Testoni Advogados Associados, trazendo uma sólida formação acadêmica com graduações em Direito, Contabilidade e Administração. Especialista em Direito Tributário e Direito Empresarial, Paulo lidera todas as questões relacionadas a essas áreas, tanto no âmbito judicial quanto administrativo. Com uma vasta experiência e conhecimento técnico, Paulo é responsável por desenvolver estratégias jurídicas eficazes para empresas e indivíduos, assegurando a conformidade com a legislação vigente e otimizando a eficiência fiscal. Sua atuação abrange a consultoria preventiva, a defesa em processos tributários e a gestão de litígios empresariais, sempre com o objetivo de proteger os interesses de seus clientes. Além de suas responsabilidades jurídicas, Paulo também desempenha um papel fundamental na orientação e desenvolvimento da equipe do escritório, compartilhando seu conhecimento e expertise para fortalecer a prática coletiva. Sua liderança e dedicação são essenciais para o sucesso contínuo do escritório nas áreas de Direito Tributário e Empresarial.",
  },
  {
    name: "Leticia Karoline de Oliveira",
    role: "Advogada associada",
    initials: "LO",
    description:
      "Leticia Karoline de Oliveira é advogada associada no escritório Carmem Testoni Advogados Associados. Formada em Direito, Leticia é responsável pela área de Direito de Família, onde atua com dedicação e expertise para oferecer soluções jurídicas personalizadas aos seus clientes. Com um profundo conhecimento das questões familiares, Leticia lida com uma variedade de demandas judiciais, incluindo divórcios, guarda de menores, pensão alimentícia e outros conflitos familiares. Sua abordagem é sempre focada na mediação e resolução amigável, visando o melhor interesse de todas as partes envolvidas. Além de sua atuação em litígios, Leticia também oferece consultoria preventiva, ajudando seus clientes a planejar e proteger seus interesses familiares de maneira eficaz. Sua capacidade de compreender as complexidades emocionais e legais dos casos de família a torna uma profissional indispensável no escritório, garantindo um atendimento sensível e eficiente.",
  },
  {
    name: "Guilherme Neumann Ribeiro",
    role: "Assessor jurídico",
    initials: "GR",
    description:
      "Guilherme Neumann Ribeiro é assessor jurídico no escritório Carmem Testoni Advogados Associados. Ele desempenha um papel crucial no suporte aos advogados responsáveis pelo setor extrajudicial, especialmente nas áreas de Direito Empresarial e Direito Tributário. Sua dedicação e conhecimento ajudam a garantir que todas as questões extrajudiciais sejam tratadas com a devida diligência e precisão. Além disso, Guilherme auxilia a especialista em Direito das Sucessões no desenvolvimento e implementação de planejamentos sucessórios. Sua capacidade de entender e atender às necessidades dos clientes contribui para a elaboração de estratégias eficazes e personalizadas, sempre focadas na proteção do patrimônio e no cumprimento da legislação vigente. Com um compromisso contínuo com a excelência, Guilherme é uma peça-chave na equipe, garantindo que os clientes recebam um atendimento de alta qualidade e soluções jurídicas que atendam às suas expectativas.",
  },
  {
    name: "Monique Maisa Magalhães",
    role: "Marketing",
    initials: "MM",
    description:
      "Monique Maisa Magalhães é a responsável pelo departamento de marketing do escritório Carmem Testoni Advogados Associados. Formada em Marketing, Monique traz uma abordagem estratégica e criativa para todas as atividades de marketing do escritório. Desde a captação de novos clientes até a criação e manutenção da identidade visual do escritório, Monique assegura que a presença da marca seja forte e consistente. Seu trabalho inclui o desenvolvimento de campanhas de marketing, gestão das redes sociais, elaboração de materiais promocionais e criação de conteúdos que destacam os serviços e valores do escritório. Com um olhar atento para as tendências de mercado e uma habilidade excepcional em comunicação, Monique trabalha para aumentar a visibilidade do escritório e fortalecer seu relacionamento com clientes atuais e potenciais. Sua dedicação e expertise são fundamentais para o crescimento e sucesso contínuo do escritório.",
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

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main id="conteudo" className="inner-page-main">
        <section className="section about-overview-section">
          <div className="section-inner about-overview-content">
            <div className="about-overview-intro">
              <h1>Bem-vindo ao Escritório de Advocacia Carmem Testoni</h1>

              <div className="about-history-copy">
                <p>
                  Nossa história começou no coração de nossa fundadora em
                  setembro de 2019, quando ela descobriu sua verdadeira paixão
                  pelo Direito de Família e Sucessões, decidindo que essa seria a
                  área à qual dedicaria sua carreira. Em 10 de janeiro de 2022,
                  esse sonho se tornou realidade com a inauguração do Escritório
                  de Advocacia Carmem Testoni. Inicialmente, era um pequeno
                  escritório, onde nossa fundadora atuava sozinha, mas com grande
                  determinação e visão.
                </p>
                <p>
                  À medida que nosso compromisso com a excelência e o atendimento
                  personalizado começou a ser reconhecido, nossa equipe cresceu e
                  nosso escritório evoluiu. De uma modesta sala, expandimos nossas
                  operações e hoje temos o orgulho de estar localizados no Edifício
                  Helbor Office Joinville, ocupando as salas 1006 e 1703.
                </p>
                <p>
                  No Escritório de Advocacia Carmem Testoni, continuamos a nos
                  expandir e inovar, sempre mantendo o foco na qualidade do serviço
                  e na satisfação dos nossos clientes. Nossa jornada é marcada pela
                  dedicação e pelo desejo contínuo de fazer a diferença na vida
                  das pessoas através da justiça.
                </p>
                <p>
                  Temos muito orgulho em oferecer serviços jurídicos de excelência,
                  pautados pela ética, profissionalismo e dedicação ao cliente.
                  Com uma equipe de advogados altamente qualificados e uma vasta
                  experiência nas áreas de Direito de Família, Direito das
                  Sucessões e Direito Tributário, nosso objetivo é proporcionar um
                  atendimento personalizado e eficaz, sempre buscando as melhores
                  soluções para as necessidades dos nossos clientes.
                </p>
              </div>
            </div>

            <div className="about-overview-copy">

              <article className="about-text-block">
                <h2>Nossa filosofia</h2>
                <p>
                  Acreditamos que cada cliente é único e merece um atendimento
                  exclusivo e atencioso. Por isso, nos dedicamos a entender
                  profundamente as particularidades de cada caso, oferecendo uma
                  abordagem estratégica e personalizada. Nossa atuação é guiada
                  por valores como transparência, confiança e compromisso com a
                  justiça, garantindo que nossos clientes se sintam seguros e bem
                  amparados em todas as etapas do processo jurídico.
                </p>
              </article>

              <article className="about-text-block">
                <h2>Compromisso com a excelência</h2>
                <p>
                  No Escritório de Advocacia Carmem Testoni, a busca pela
                  excelência é constante. Trabalhamos incansavelmente para
                  oferecer serviços jurídicos de alta qualidade, priorizando a
                  eficiência, a ética e a inovação. Nosso compromisso é fornecer
                  soluções jurídicas que não apenas resolvam os problemas
                  imediatos, mas também agreguem valor a longo prazo para nossos
                  clientes.
                </p>
              </article>

              <article className="about-text-block">
                <h2>Relacionamento com o cliente</h2>
                <p>
                  Estabelecer um relacionamento de confiança e respeito com
                  nossos clientes é uma prioridade. Acreditamos que a comunicação
                  clara e aberta é fundamental para o sucesso de qualquer
                  parceria. Por isso, estamos sempre disponíveis para esclarecer
                  dúvidas, fornecer orientações e manter nossos clientes
                  informados sobre o andamento de seus casos.
                </p>
              </article>

              <article className="about-text-block">
                <h2>Entre em contato</h2>
                <p>
                  Estamos à disposição para atender suas necessidades jurídicas
                  com a atenção e o cuidado que você merece. Entre em contato
                  conosco para agendar uma consulta e descobrir como podemos
                  ajudá-lo.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section team-section" id="equipe">
          <div className="section-inner">
            <div className="team-heading">
              <p className="eyebrow">Nossa equipe</p>
              <h2>Nossa equipe</h2>
              <p>
                Nossa equipe é composta por profissionais altamente capacitados
                e com ampla experiência nas nossas áreas atuantes do direito.
                Valorizamos a constante atualização e aprimoramento técnico de
                nossa equipe, assegurando que estamos sempre prontos para
                enfrentar os desafios jurídicos contemporâneos com conhecimento
                e competência.
              </p>
            </div>

            <div className="team-list">
              {teamMembers.map((member, index) => (
                <article
                  className={`team-member ${index % 2 === 1 ? "is-reversed" : ""}`}
                  key={member.name}
                >
                  <div
                    className="team-photo-placeholder"
                    role="img"
                    aria-label={`Espaço reservado para foto profissional de ${member.name}`}
                  >
                    <span>{member.initials}</span>
                    <small>Foto profissional</small>
                  </div>
                  <div className="team-member-copy">
                    <p className="team-role">{member.role}</p>
                    <h3>{member.name}</h3>
                    <p>{member.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-differentials-section" id="diferenciais">
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
      </main>

      <SiteFooter />
    </>
  );
}
