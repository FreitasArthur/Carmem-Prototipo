import type { Metadata } from "next";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

export const metadata: Metadata = {
  title: "Direito das sucessões | Carmem Testoni",
};

export default function SuccessionLawPage() {
  return (
    <div className="practice-detail-page">
      <SiteHeader />

      <main
        id="conteudo"
        className="inner-page-main practice-detail-placeholder"
        aria-label="Direito das sucessões"
      >
        {/* Insira aqui o conteúdo desta área de atuação. */}
      </main>

      <SiteFooter />
    </div>
  );
}
