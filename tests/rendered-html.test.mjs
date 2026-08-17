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
  ["cloud", "flare"].join(""),
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
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /Carmem Testoni \| Advogados Associados em Joinville/);
  assert.match(page, /Proteção patrimonial e assessoria jurídica estratégica/);
  assert.match(page, /https:\/\/wa\.me\/\$\{officeWhatsapp\}/);
  assert.match(page, /Planejamento patrimonial e sucessório/);
  assert.match(page, /Direito empresarial/);
  assert.match(page, /Enviar mensagem/);
});

test("keeps header navigation destinations predictable", async () => {
  const [header, page] = await Promise.all([
    readFile(new URL("../app/components/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(header, /href="\/"/);
  assert.match(header, /href: "\/#escritorio"/);
  assert.match(header, /href: "\/#contato"/);
  assert.doesNotMatch(header, /href: "\/areas-de-atuacao"/);
  assert.doesNotMatch(header, /href: "\/sobre"/);
  assert.match(header, /target\.scrollIntoView/);
  assert.match(header, /window\.scrollTo/);
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

test("provides a placeholder page for every practice area", async () => {
  const practiceAreas = [
    ["planejamento-patrimonial-e-sucessorio", "Planejamento patrimonial e sucessório"],
    ["empresarial", "Empresarial"],
    ["tributario", "Tributário"],
    ["direito-das-sucessoes", "Direito das sucessões"],
    ["direito-de-familia", "Direito de família"],
  ];

  for (const [slug, title] of practiceAreas) {
    const detailPage = await readFile(
      new URL(`../app/areas-de-atuacao/${slug}/page.tsx`, import.meta.url),
      "utf8",
    );

    assert.match(detailPage, new RegExp(title));
    assert.match(detailPage, /<SiteHeader \/>/);
    assert.match(detailPage, /practice-detail-placeholder/);
    assert.match(detailPage, /Insira aqui o conteúdo desta área de atuação/);
    assert.match(detailPage, /<SiteFooter \/>/);
  }
});
