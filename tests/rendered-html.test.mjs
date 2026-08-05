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
