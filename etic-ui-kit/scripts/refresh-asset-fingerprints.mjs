// Run only after reviewing intentional asset edits. Never part of `check`.
import fs from "node:fs";
import { createHash } from "node:crypto";
const file = "etic-ui/asset-manifest.json";
const assets = JSON.parse(fs.readFileSync(file, "utf8"));
let changed = 0;
for (const asset of assets) {
  const bytes = fs.readFileSync("etic-ui/assets/" + asset.path);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (asset.bytes !== bytes.length || asset.sha256 !== sha256) {
    changed++;
    console.log(`Recording reviewed content: ${asset.name}`);
  }
  asset.bytes = bytes.length;
  asset.sha256 = sha256;
}
fs.writeFileSync(file, JSON.stringify(assets, null, 2) + "\n");
console.log(
  `${changed} fingerprints updated. Check dimensions if artwork changed, then run npm run catalog:generate.`,
);
