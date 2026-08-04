import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const title = "Carmem Testoni | Advogados Associados em Joinville";
const description =
  "Assessoria jurídica em planejamento patrimonial e sucessório, Direito Empresarial, Tributário, Sucessões e Família. Atendimento em Joinville e on-line.";
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

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const baseUrl = host ? `${protocol}://${host}` : "https://carmemtestoni.com.br";
  const ogImage = `${baseUrl}/og.png`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: "Carmem Testoni | Advogados Associados",
      description:
        "Assessoria jurídica estratégica para famílias, patrimônios e empresas em Joinville e on-line.",
      type: "website",
      locale: "pt_BR",
      url: baseUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Carmem Testoni | Advogados Associados",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
