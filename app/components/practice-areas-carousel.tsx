"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";

// Ajuste este valor, em milissegundos, para alterar o tempo entre os grupos.
export const PRACTICE_CAROUSEL_INTERVAL_MS = 5000;

const practiceAreas = [
  {
    title: "Planejamento patrimonial e sucessório",
    image: "/areas/planejamento-patrimonial.webp",
    text: "Estruturação jurídica para organizar, proteger e transmitir o patrimônio em vida, reduzindo conflitos futuros entre herdeiros e otimizando aspectos tributários e sucessórios.",
  },
  {
    title: "Empresarial",
    image: "/areas/empresarial.webp",
    text: "Assessoria jurídica estratégica para empresas e empresários, com foco na prevenção de riscos e na segurança das relações comerciais.",
  },
  {
    title: "Tributário",
    image: "/areas/tributario.webp",
    text: "Análise da carga tributária e desenvolvimento de estratégias fiscais compatíveis com a legislação, reduzindo riscos e contingências para pessoas físicas e empresas.",
  },
  {
    title: "Sucessões",
    image: "/areas/sucessoes.webp",
    text: "Condução de inventários, partilhas e testamentos, com atenção à sensibilidade do momento e busca por soluções ágeis e seguras para a família.",
  },
  {
    title: "Trabalhista",
    image: "/areas/trabalhista.webp",
    text: "Orientação preventiva e defesa em questões trabalhistas, ajudando o empresário a reduzir passivos e manter a conformidade nas relações de trabalho.",
  },
  {
    title: "Societário",
    image: "/areas/societario.webp",
    text: "Estruturação e reorganização societária, elaboração de contratos sociais e acordos de sócios, com foco na segurança jurídica das relações entre os sócios.",
  },
  {
    title: "Imobiliário",
    image: "/areas/imobiliario.webp",
    text: "Assessoria em contratos de compra, venda e locação de imóveis, due diligence imobiliária e regularização de bens.",
  },
  {
    title: "Cível",
    image: "/areas/civel.webp",
    text: "Atuação consultiva e contenciosa em questões cíveis, com foco na proteção dos interesses do cliente em suas relações jurídicas do dia a dia.",
  },
  {
    title: "Família",
    image: "/areas/familia.webp",
    text: "Atuação cuidadosa em divórcio, guarda, pensão e união estável, equilibrando a sensibilidade das relações familiares com a segurança jurídica necessária.",
  },
  {
    title: "Consumidor",
    image: "/areas/consumidor.webp",
    text: "Defesa dos direitos do consumidor e orientação a empresas para prevenção de riscos e conformidade nas relações de consumo.",
  },
];

const practiceSlides = Array.from(
  { length: Math.ceil(practiceAreas.length / 2) },
  (_, index) => practiceAreas.slice(index * 2, index * 2 + 2),
);

export function PracticeAreasCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timerRevision, setTimerRevision] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const showSlide = useCallback((index: number) => {
    setCurrentSlide((index + practiceSlides.length) % practiceSlides.length);
    setTimerRevision((revision) => revision + 1);
  }, []);

  const showNext = useCallback(() => {
    setCurrentSlide((current) => (current + 1) % practiceSlides.length);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(showNext, PRACTICE_CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, showNext, timerRevision]);

  return (
    <div
      className="practice-carousel"
      aria-label="Áreas de atuação"
      aria-roledescription="carrossel"
      role="region"
    >
      <div className="practice-carousel-viewport">
        <div className="practice-carousel-track">
          {practiceSlides.map((areas, slideIndex) => (
            <div
              className={`practice-carousel-slide${slideIndex === currentSlide ? " is-active" : ""}`}
              aria-hidden={slideIndex !== currentSlide}
              aria-label={`${slideIndex + 1} de ${practiceSlides.length}`}
              aria-roledescription="slide"
              key={areas.map((area) => area.title).join("-")}
              role="group"
            >
              {areas.map((area) => (
                <article
                  className="practice-story"
                  key={area.title}
                  style={{
                    "--practice-image": `url("${area.image}")`,
                  } as CSSProperties}
                >
                  <div className="practice-story-copy">
                    <h3>{area.title}</h3>
                    <p>{area.text}</p>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="practice-carousel-footer">
        <div className="practice-carousel-pagination" aria-label="Selecionar grupo de áreas">
          {practiceSlides.map((areas, index) => (
            <button
              className={index === currentSlide ? "is-active" : undefined}
              type="button"
              aria-label={`Exibir ${areas.map((area) => area.title).join(" e ")}`}
              aria-current={index === currentSlide ? "true" : undefined}
              key={areas.map((area) => area.title).join("-")}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>

        <p className="practice-carousel-counter">
          <span>{String(currentSlide + 1).padStart(2, "0")}</span>
          <span aria-hidden="true">/</span>
          <span>{String(practiceSlides.length).padStart(2, "0")}</span>
        </p>
      </div>
    </div>
  );
}
