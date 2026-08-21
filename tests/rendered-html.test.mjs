import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { extname } from "node:path";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);
const ignoredDirectories = new Set([".next", ".git", "node_modules"]);
const forbiddenPlatformTerms = [
  ["open", "ai"].join(""),
  ["chat", "gpt"].join(""),
  ["vin", "ext"].join(""),
  ["wrang", "ler"].join(""),
  ["d1", "database"].join(""),
];

async function collectProjectFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;

    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directoryUrl);
    if (entry.isDirectory()) {
      files.push(...await collectProjectFiles(entryUrl));
      continue;
    }

    files.push(entryUrl);
  }

  return files;
}

test("keeps the site independent from former starter runtimes", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  for (const dependencyName of Object.keys(dependencies)) {
    const normalized = dependencyName.toLowerCase();
    for (const term of forbiddenPlatformTerms) {
      assert.equal(normalized.includes(term), false, dependencyName);
    }
  }

  const projectFiles = await collectProjectFiles(templateRoot);
  const textFileExtensions = new Set([
    ".json",
    ".md",
    ".mjs",
    ".ts",
    ".tsx",
    ".css",
    ".svg",
  ]);

  for (const fileUrl of projectFiles) {
    if (!textFileExtensions.has(extname(fileUrl.pathname))) {
      continue;
    }

    const content = await readFile(fileUrl, "utf8");
    const normalized = content.toLowerCase();

    for (const term of forbiddenPlatformTerms) {
      assert.equal(
        normalized.includes(term),
        false,
        `${fileUrl.pathname} still references ${term}`,
      );
    }
  }
});

test("preserves the main landing page content and contact flow", async () => {
  const [page, layout, siteData, carousel] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/practice-areas-carousel.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /Carmem Testoni \| Advogados Associados em Joinville/);
  assert.match(page, /O que você construiu merece a proteção jurídica certa/);
  assert.match(page, /https:\/\/wa\.me\/\$\{officeWhatsapp\}/);
  assert.match(carousel, /Planejamento patrimonial e sucessório/);
  assert.match(carousel, /Empresarial/);
  assert.doesNotMatch(page, /Conheça nossa atuação/);
  assert.match(page, /className="button hero-contact-button"/);
  assert.match(page, /className="social-link process-whatsapp-link"/);
  assert.match(page, /aria-label="Iniciar contato pelo WhatsApp"/);
  assert.match(page, /Entrar em contato/);
  assert.match(page, /Enviar mensagem/);
  assert.match(siteData, /officePhone = "\+55 47 99734-2205"/);
  assert.match(siteData, /officeWhatsapp = "5547997342205"/);
  assert.match(siteData, /officeEmail = "contato@carmemtestoni\.com\.br"/);
});

test("sends every displayed contact subject unchanged in the WhatsApp message", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /contactSubjects\.map\(\(subject\) => \(/);
  assert.match(page, /<option key=\{subject\} value=\{subject\}>\s*\{subject\}/);
  assert.match(page, /buildContactWhatsappMessage\(form\)/);
});

test("keeps the official office photo proportional on responsive layouts", async () => {
  const [page, styles, officePhoto] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/office-of.jpeg", import.meta.url)),
  ]);

  assert.match(page, /about: "\/office-of\.jpeg"/);
  assert.match(page, /width="1280"/);
  assert.match(page, /height="881"/);
  assert.match(page, /Recep\u00e7\u00e3o oficial do escrit\u00f3rio Carmem Testoni/);
  assert.match(
    styles,
    /\.image-feature\s*\{[^}]*max-width:\s*560px;[^}]*aspect-ratio:\s*1280\s*\/\s*881;[^}]*align-self:\s*center;/s,
  );
  assert.match(
    styles,
    /\.image-feature img,[^{]*\{[^}]*width:\s*100%;[^}]*height:\s*auto;[^}]*object-fit:\s*contain;/s,
  );
  assert.deepEqual([...officePhoto.subarray(0, 3)], [0xff, 0xd8, 0xff]);

  const representativeViewportWidths = [320, 390, 768, 1024, 1366, 1920, 3840];
  for (const viewportWidth of representativeViewportWidths) {
    const renderedWidth = Math.min(viewportWidth, 560);
    const renderedHeight = renderedWidth * (881 / 1280);
    assert.ok(Math.abs((renderedWidth / renderedHeight) - (1280 / 881)) < 1e-12);
  }
});

test("keeps both contact cards aligned to the same desktop height", async () => {
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(styles, /\.contact-grid\s*\{[^}]*align-items:\s*stretch;/s);
});

test("renders the home content immediately without scroll reveal effects", async () => {
  const [page, instagramProfile, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/instagram-profile.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const revealImplementation = /IntersectionObserver|data-reveal|reveal-ready|is-visible/;

  assert.doesNotMatch(page, revealImplementation);
  assert.doesNotMatch(instagramProfile, revealImplementation);
  assert.doesNotMatch(styles, revealImplementation);
  assert.match(styles, /scroll-behavior:\s*smooth/);
});

test("keeps header navigation destinations predictable", async () => {
  const [header, page, siteData] = await Promise.all([
    readFile(new URL("../app/components/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(header, /href="\/"/);
  assert.match(header, /href: "\/#escritorio"/);
  assert.match(header, /href: "\/#contato"/);
  assert.doesNotMatch(header, /href: "\/areas-de-atuacao"/);
  assert.doesNotMatch(header, /href: "\/sobre"/);
  assert.match(header, /target\.scrollIntoView/);
  assert.match(header, /window\.scrollTo/);
  assert.match(header, /href=\{instagramProfileUrl\}/);
  assert.match(header, /href=\{linkedinProfileUrl\}/);
  assert.match(siteData, /https:\/\/www\.instagram\.com\/advocaciacarmemtestoni\//);
  assert.match(
    siteData,
    /https:\/\/www\.linkedin\.com\/in\/carmem-testoni-advogados-associados-034555419\//,
  );
  assert.match(page, /id="inicio"/);
  assert.match(page, /id="escritorio"/);
  assert.match(page, /id="areas-de-atuacao"/);
  assert.match(page, /id="diferenciais"/);
  assert.match(page, /id="contato"/);
  assert.match(page, /<InstagramProfile \/>/);
});

test("uses the official symbol in the footer and browser metadata", async () => {
  const [footer, layout] = await Promise.all([
    readFile(new URL("../app/components/site-footer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  const symbolPath = /logo-carmem-testoni-icone-redondo-transparente\.png/;

  assert.match(footer, symbolPath);
  assert.match(footer, /href="\/#inicio"/);
  assert.match(layout, symbolPath);
  assert.doesNotMatch(footer, /brand-mark/);
});

test("keeps every practice area in one adjustable two-at-a-time carousel", async () => {
  const practiceAreas = [
    ["planejamento-patrimonial-e-sucessorio", "Planejamento patrimonial e sucessório"],
    ["empresarial", "Empresarial"],
    ["tributario", "Tributário"],
    ["direito-das-sucessoes", "Sucessões"],
    ["direito-de-familia", "Trabalhista"],
    ["societario", "Societário"],
    ["imobiliario", "Imobiliário"],
    ["civel", "Cível"],
    ["familia", "Família"],
    ["consumidor", "Consumidor"],
  ];
  const [page, carousel, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/practice-areas-carousel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<PracticeAreasCarousel \/>/);
  assert.doesNotMatch(page, /Saiba mais/);
  assert.match(carousel, /PRACTICE_CAROUSEL_INTERVAL_MS = \d+/);
  assert.match(carousel, /practiceAreas\.slice\(index \* 2, index \* 2 \+ 2\)/);
  assert.match(carousel, /window\.setInterval\(showNext, PRACTICE_CAROUSEL_INTERVAL_MS\)/);
  assert.match(carousel, /setTimerRevision\(\(revision\) => revision \+ 1\)/);
  assert.match(carousel, /\[prefersReducedMotion, showNext, timerRevision\]/);
  assert.match(carousel, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(carousel, /ChevronLeft|ChevronRight|Pause|Play/);
  assert.doesNotMatch(styles, /\.practice-carousel-controls/);
  assert.match(styles, /\.practice-carousel-track/);
  assert.match(styles, /\.practice-carousel-slide\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(styles, /\.practice-carousel\s*\{[^}]*--carousel-overhang:[^}]*width:\s*calc\(100% \+ var\(--carousel-overhang\)\)/s);
  assert.match(styles, /\.practice-story\s*\{[^}]*align-items:\s*center/s);
  assert.doesNotMatch(carousel, /const absoluteIndex/);
  assert.doesNotMatch(styles, /\.practice-story-copy > span/);
  assert.doesNotMatch(styles, /\.practice-card(?:\s|\{|:)/);

  for (const [slug, title] of practiceAreas) {
    assert.match(carousel, new RegExp(title));
    await assert.rejects(
      readFile(new URL(`../app/areas-de-atuacao/${slug}/page.tsx`, import.meta.url), "utf8"),
      { code: "ENOENT" },
    );
  }
});
