import type { Metadata } from "next";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

export const metadata: Metadata = {
  title: "Planejamento patrimonial e sucessório | Carmem Testoni",
};

export default function EstatePlanningPage() {
  return (
    <div className="practice-detail-page">
      <SiteHeader />

      <main
        id="conteudo"
        className="inner-page-main practice-detail-placeholder"
        aria-label="Planejamento patrimonial e sucessório"
      >
        {/* Insira aqui o conteúdo desta área de atuação. */}
      </main>

      <SiteFooter />
    </div>
  );
}
