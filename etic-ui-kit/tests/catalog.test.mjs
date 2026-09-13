import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = process.cwd();
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "etic-catalog-"));
  for (const item of [
    "etic-ui",
    "docs",
    "README.md",
    "AGENTS.md",
    ".agents/skills/etic-ui",
  ]) {
    const dest = path.join(dir, item);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(path.join(root, item), dest, { recursive: true });
  }
  return dir;
}
function run(script, dir, args = []) {
  return spawnSync(
    process.execPath,
    [path.join(root, "scripts", script), ...args],
    { cwd: dir, encoding: "utf8" },
  );
}
test("same-size damage to an asset is detected", () => {
  const dir = fixture();
  try {
    assert.equal(run("check-assets.mjs", dir).status, 0);
    const manifest = JSON.parse(
      fs.readFileSync(path.join(dir, "etic-ui/asset-manifest.json")),
    );
    const file = path.join(
      dir,
      "etic-ui/assets",
      manifest.find((a) => a.format === "svg").path,
    );
    const bytes = fs.readFileSync(file);
    bytes[bytes.length - 2] ^= 1;
    fs.writeFileSync(file, bytes);
    const result = run("check-assets.mjs", dir);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Asset contents changed/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
test("stale generated files fail without being silently overwritten", () => {
  const dir = fixture();
  try {
    const file = path.join(dir, "etic-ui/catalog.ts");
    const altered = fs.readFileSync(file, "utf8") + "\n// local drift\n";
    fs.writeFileSync(file, altered);
    const result = run("update-catalog.mjs", dir, ["--check"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Generated file is stale/);
    assert.equal(fs.readFileSync(file, "utf8"), altered);
    assert.equal(run("update-catalog.mjs", dir).status, 0);
    assert.equal(run("update-catalog.mjs", dir, ["--check"]).status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a complete copy preserves documentation and refuses to overwrite a project", () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "etic-copy-"));
  const destination = path.join(base, "etic-kit");
  try {
    const result = spawnSync(
      process.execPath,
      [path.join(root, "scripts/copy-kit.mjs"), destination],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(run("check-assets.mjs", destination).status, 0);
    assert.equal(run("update-catalog.mjs", destination, ["--check"]).status, 0);
    assert(!fs.existsSync(path.join(destination, "node_modules")));
    const marker = path.join(destination, "keep-me");
    fs.writeFileSync(marker, "user work");
    const retry = spawnSync(
      process.execPath,
      [path.join(root, "scripts/copy-kit.mjs"), destination],
      { encoding: "utf8" },
    );
    assert.notEqual(retry.status, 0);
    assert.equal(fs.readFileSync(marker, "utf8"), "user work");
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});
