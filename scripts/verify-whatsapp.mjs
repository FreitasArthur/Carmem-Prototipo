import { readFile, readdir } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const expectedWhatsappNumber = "5547997342205";

const whatsappLinkPattern = /https:\/\/wa\.me\/(\d+)/g;
const outputTextExtensions = new Set([".html", ".js", ".json", ".txt"]);

export function assertExpectedWhatsappNumber(actualNumber, sourceLabel) {
  if (actualNumber !== expectedWhatsappNumber) {
    throw new Error(
      `${sourceLabel} aponta para um WhatsApp nao autorizado: ${actualNumber}`,
    );
  }
}

export function verifyWhatsappLinks(content, sourceLabel) {
  const numbers = Array.from(content.matchAll(whatsappLinkPattern), (match) => match[1]);

  for (const number of numbers) {
    assertExpectedWhatsappNumber(number, sourceLabel);
  }

  return numbers.length;
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(entryPath));
      continue;
    }

    if (outputTextExtensions.has(extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

export async function verifyWhatsappIntegrity({ projectRoot, outputDirectory }) {
  const siteDataPath = join(projectRoot, "app", "site-data.ts");
  const siteData = await readFile(siteDataPath, "utf8");
  const numberDeclaration = siteData.match(
    /officeWhatsapp\s*=\s*["'](\d+)["']/,
  );

  if (!numberDeclaration) {
    throw new Error("Nao foi possivel localizar officeWhatsapp em app/site-data.ts.");
  }

  assertExpectedWhatsappNumber(numberDeclaration[1], "app/site-data.ts");

  const outputFiles = await collectFiles(outputDirectory);
  let verifiedLinkCount = 0;

  for (const filePath of outputFiles) {
    const content = await readFile(filePath, "utf8");
    verifiedLinkCount += verifyWhatsappLinks(content, filePath);
  }

  if (verifiedLinkCount === 0) {
    throw new Error("Nenhum link wa.me foi encontrado na exportacao final.");
  }

  return verifiedLinkCount;
}

async function runCli() {
  const projectRoot = resolve(fileURLToPath(new URL("../", import.meta.url)));
  const outputFlagIndex = process.argv.indexOf("--output");
  const outputDirectory = resolve(
    projectRoot,
    outputFlagIndex >= 0 ? process.argv[outputFlagIndex + 1] : "out",
  );
  const verifiedLinkCount = await verifyWhatsappIntegrity({
    projectRoot,
    outputDirectory,
  });

  console.log(
    `WhatsApp verificado: ${verifiedLinkCount} link(s) apontam para o numero oficial.`,
  );
}

const isDirectExecution =
  process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  runCli().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
