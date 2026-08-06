import type { Metadata } from "next";
import "./globals.css";

const title = "Carmem Testoni | Advogados Associados em Joinville";
const description =
  "Assessoria jurídica em planejamento patrimonial e sucessório, Direito Empresarial, Tributário, Sucessões e Família. Atendimento em Joinville e on-line.";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
  .replace(/\/$/, "");
const keywords = [
  "Advogados em Joinville",
  "Planejamento patrimonial em Joinville",
  "Planejamento sucessório",
  "Holding familiar",
  "Direito Empresarial",
  "Direito Tributário",
  "Inventário em Joinville",
  "Direito de Família em Joinville",
  "Assessoria para empresas familiares",
];

export const metadata: Metadata = {
  title,
  description,
  keywords,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Escritório de Advocacia | Carmem Testoni",
    description:
      "Assessoria jurídica estratégica para famílias, patrimônios e empresas em Joinville e on-line.",
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Escritório de Advocacia | Carmem Testoni",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: "/logo-carmem-testoni-icone-redondo-transparente.png",
    shortcut: "/logo-carmem-testoni-icone-redondo-transparente.png",
    apple: "/logo-carmem-testoni-icone-redondo-transparente.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
