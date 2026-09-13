/** Copy a complete, self-contained kit into a NEW folder. Never overwrites a project. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argument = process.argv[2];
if (!argument) throw Error("Usage: npm run copy:kit -- /path/to/new/etic-kit");
const destination = path.resolve(argument);
const relative = path.relative(source, destination);
if (
  !relative ||
  (!relative.startsWith(".." + path.sep) &&
    relative !== ".." &&
    !path.isAbsolute(relative))
)
  throw Error("Choose a destination outside the source kit.");
if (fs.existsSync(destination))
  throw Error(
    "Destination already exists. Choose a new folder; no files were overwritten.",
  );
const entries = [
  "etic-ui",
  "docs",
  ".agents/skills/etic-ui",
  "AGENTS.md",
  "README.md",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  ".gitignore",
  "scripts",
  "tests",
];
for (const entry of entries)
  if (!fs.existsSync(path.join(source, entry)))
    throw Error(`Missing source: ${entry}`);
fs.mkdirSync(destination, { recursive: true });
for (const entry of entries) {
  const target = path.join(destination, entry);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(path.join(source, entry), target, {
    recursive: true,
    filter: (src) => path.basename(src) !== ".DS_Store",
  });
}
console.log(
  `Kit copied to ${destination}. Local documentation links are preserved. No node_modules copied.`,
);
