import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import assert from "node:assert/strict";
const list = JSON.parse(fs.readFileSync("etic-ui/asset-manifest.json", "utf8"));
const allKeys = new Set();
const names = new Set(),
  paths = new Set();
for (const a of list) {
  assert(!names.has(a.name), `Duplicate name: ${a.name}`);
  names.add(a.name);
  for (const key of [a.name, ...(a.aliases ?? [])]) {
    assert(!allKeys.has(key), `Duplicate key or alias: ${key}`);
    allKeys.add(key);
  }
  if (a.category === "ribbons") {
    assert(
      ["warm", "cool", "neutral"].includes(a.ribbonFamily),
      `Missing ribbon family: ${a.name}`,
    );
    assert(
      a.path.startsWith(`ribbons/${a.ribbonFamily}/`),
      `Ribbon stored outside its family: ${a.name}`,
    );
  }
  if (a.category === "geometric")
    assert(
      ["primitive", "module", "composition"].includes(a.kind),
      `Missing geometry level: ${a.name}`,
    );
  assert(!paths.has(a.path), `Duplicate path: ${a.path}`);
  paths.add(a.path);
  assert(
    !a.path.includes("..") && !path.isAbsolute(a.path),
    "Asset paths must stay in assets/",
  );
  assert(a.width > 0 && a.height > 0, `Invalid dimensions: ${a.name}`);
  assert(
    a.source.includes(`node-id=${a.nodeId.replace(":", "-")}`),
    `Source mismatch: ${a.name}`,
  );
  const bytes = fs.readFileSync("etic-ui/assets/" + a.path);
  assert.equal(
    bytes.length,
    a.bytes,
    `Size mismatch, update manifest: ${a.path}`,
  );
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    a.sha256,
    `Asset contents changed: ${a.path}`,
  );
  if (a.format === "svg") {
    const text = bytes.toString();
    assert(
      /<svg\b/.test(text) && /viewBox=/.test(text),
      `SVG must have a viewBox: ${a.path}`,
    );
    assert(
      !/<script\b|<foreignObject\b|\son\w+=/.test(text),
      `Unexpected active SVG content: ${a.path}`,
    );
    for (const m of text.matchAll(/(?:xlink:)?href=["']([^"']+)["']/g))
      assert(
        m[1].startsWith("#") || m[1].startsWith("data:"),
        `External dependency: ${a.path}`,
      );
  } else if (a.format === "webp")
    assert(
      bytes.toString("ascii", 0, 4) === "RIFF" &&
        bytes.toString("ascii", 8, 12) === "WEBP",
      `Invalid WebP: ${a.path}`,
    );
  else if (a.format === "png")
    assert(
      bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      `Invalid PNG: ${a.path}`,
    );
  else throw Error(`Unsupported format: ${a.format}`);
}
for (const p of fs
  .readdirSync("etic-ui/assets", { recursive: true })
  .filter((p) => /\.(svg|webp|png)$/.test(p)))
  assert(paths.has(p.split(path.sep).join("/")), `Unindexed file: ${p}`);
const boards = JSON.parse(
  fs.readFileSync("docs/brand/board-inventory.json", "utf8"),
).boards;
for (const b of boards)
  assert(
    fs.existsSync(`docs/brand/boards/${b.id.replace(":", "-")}.webp`),
    `Missing board: ${b.id}`,
  );
for (const file of [
  "README.md",
  "AGENTS.md",
  ...fs
    .readdirSync("docs", { recursive: true })
    .filter((p) => p.endsWith(".md"))
    .map((p) => "docs/" + p),
  ...fs
    .readdirSync("etic-ui/assets", { recursive: true })
    .filter((p) => p.endsWith(".md"))
    .map((p) => "etic-ui/assets/" + p),
  ".agents/skills/etic-ui/SKILL.md",
]) {
  const text = fs.readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "");
  const links = [...text.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
  const images = [...text.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(
    (m) => m[1],
  );
  for (const link of [...links, ...images])
    if (!/^(https?:|#)/.test(link))
      assert(
        fs.existsSync(path.resolve(path.dirname(file), link.split("#")[0])),
        `Broken link: ${file} -> ${link}`,
      );
}
console.log(
  `${list.length} assets, ${boards.length} reference boards, signatures, sources and documentation links verified.`,
);
