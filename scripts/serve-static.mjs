import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const outputDirectory = resolve(process.cwd(), "out");
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const host = "127.0.0.1";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  const relativePath = normalize(pathname).replace(/^[/\\]+/, "");
  const candidate = resolve(outputDirectory, relativePath);

  if (candidate !== outputDirectory && !candidate.startsWith(`${outputDirectory}${sep}`)) {
    return null;
  }

  return candidate;
}

async function findFile(requestUrl) {
  const candidate = resolveRequestPath(requestUrl);
  if (!candidate) return null;

  const candidates = [
    candidate,
    join(candidate, "index.html"),
    `${candidate}.html`,
  ];

  for (const filePath of candidates) {
    try {
      if ((await stat(filePath)).isFile()) return filePath;
    } catch {
      // Continue procurando a forma exportada pelo Next.js.
    }
  }

  return null;
}

const server = createServer(async (request, response) => {
  try {
    const filePath = await findFile(request.url ?? "/");
    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
  }
});

server.listen(port, host, () => {
  console.log(`Preview local em http://${host}:${port}`);
});
