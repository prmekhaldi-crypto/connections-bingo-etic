import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const root = process.cwd();
const css = ["tokens.css", "brand.css", "art-gradients.css", "styles.css"]
  .map((p) =>
    fs
      .readFileSync(path.join(root, "etic-ui", p), "utf8")
      .replace(/@import[^;]+;/g, ""),
  )
  .join("\n");
let browser, script;
before(async () => {
  const entry = `import React,{useState,useRef} from 'react';import {createRoot} from 'react-dom/client';import {BrandArtwork,BrandCard,BrandHeading,Button,IconButton,Logo,Progress} from './etic-ui';function App(){const [n,setN]=useState(0);const actionRef=useRef(null);return <><button id="outside">Outside the theme</button><main className="etic-theme" style={{padding:24,background:'#FFFCF7'}}><div className="qa-grid">{['paper','wide','wide-soft','story','label','caption','amber','tab'].map(v=><BrandCard key={v} variant={v} className="etic-stack"><BrandHeading accent={v}>Le collectif</BrandHeading><p className="etic-copy">Instructions accessibles pour tous les membres.</p><div><Button ref={v==='paper'?actionRef:undefined} onClick={()=>setN(x=>x+1)}>Continuer {v}</Button></div></BrandCard>)}</div><BrandArtwork name="ribbon-cool-loop-01" width={120}/><Logo width={72}/><div className="etic-row"><Button onClick={()=>actionRef.current?.focus()}>Retour au bouton</Button><Button disabled>Indisponible</Button><Button loading>Enregistrer</Button><IconButton label="Aide" onClick={()=>setN(x=>x+1)}>?</IconButton></div><Progress value={n} max={10} label="Étapes"/><Progress value={-5} max={0} label="Entrée invalide"/><p data-testid="count">{n}</p></main></>};createRoot(document.getElementById('root')).render(<App/>);`;
  const result = await build({
    stdin: { contents: entry, loader: "tsx", resolveDir: root },
    bundle: true,
    write: false,
    format: "iife",
    jsx: "automatic",
    loader: { ".svg": "dataurl", ".png": "dataurl", ".webp": "dataurl" },
    logLevel: "silent",
  });
  script = result.outputFiles[0].text;
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  await browser?.close();
});
for (const width of [390, 1400])
  test(`React UI, keyboard and layout at ${width}px`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      await page.setContent(
        `<html lang="fr"><head><style>body{margin:0}.qa-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}@media(max-width:650px){.qa-grid{grid-template-columns:1fr}}${css}</style></head><body><div id="root"></div></body></html>`,
      );
      await page.addScriptTag({ content: script });
      await page
        .getByRole("button", { name: "Continuer paper", exact: true })
        .click();
      await page.waitForFunction(
        () => document.querySelector("[data-testid=count]").textContent === "1",
      );
      const keyboard = page.getByRole("button", {
        name: "Continuer story",
        exact: true,
      });
      await keyboard.focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(
        () => document.querySelector("[data-testid=count]").textContent === "2",
      );
      assert.equal(
        await keyboard.evaluate((el) => getComputedStyle(el).outlineStyle),
        "solid",
      );
      assert(
        await page.getByRole("button", { name: "Indisponible" }).isDisabled(),
      );
      assert(
        await page.getByRole("button", { name: /Enregistrer/ }).isDisabled(),
      );
      assert.equal(
        await page
          .getByRole("button", { name: /Enregistrer/ })
          .getAttribute("aria-busy"),
        "true",
      );
      await page.getByRole("button", { name: "Aide", exact: true }).click();
      await page.waitForFunction(
        () => document.querySelector("[data-testid=count]").textContent === "3",
      );
      assert.equal(
        await page
          .getByRole("progressbar", { name: /Étapes/ })
          .getAttribute("value"),
        "3",
      );
      const invalid = page.getByRole("progressbar", {
        name: /Entrée invalide/,
      });
      assert.equal(await invalid.getAttribute("max"), "1");
      assert.equal(await invalid.getAttribute("value"), "0");
      const logo = await page.locator(".etic-logo").evaluate((el) => ({
        padding: parseFloat(getComputedStyle(el).paddingLeft),
        width: el.querySelector("img").getBoundingClientRect().width,
      }));
      assert(logo.padding >= logo.width * 0.1656);
      assert(await page.locator(".etic-brand-artwork").getAttribute("width"));
      assert(await page.locator(".etic-brand-artwork").getAttribute("height"));
      assert.equal(
        await page.locator(".etic-brand-artwork").getAttribute("aria-hidden"),
        "true",
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.notEqual(
        await page
          .locator("#outside")
          .evaluate((el) => getComputedStyle(el).minHeight),
        "48px",
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      assert.equal(
        (
          await page
            .locator(".etic-theme")
            .evaluate((el) =>
              getComputedStyle(el).getPropertyValue("--etic-duration"),
            )
        ).trim(),
        "0ms",
      );
      await page.getByRole("button", { name: "Retour au bouton" }).click();
      assert(
        await page
          .getByRole("button", { name: "Continuer paper", exact: true })
          .evaluate((el) => el === document.activeElement),
      );
      assert.deepEqual(errors, []);
    } finally {
      await page.close();
    }
  });
test("Plain HTML consumes the same CSS without React", async () => {
  const page = await browser.newPage();
  try {
    await page.setContent(
      `<style>${css}</style><div class="etic-theme"><section class="etic-brand-card etic-brand-card--story"><h2 class="etic-heading">Instructions</h2><button class="etic-button" type="button">Commencer</button></section></div>`,
    );
    const button = page.getByRole("button", { name: "Commencer" });
    await button.focus();
    assert.equal(
      await button.evaluate((el) => getComputedStyle(el).minHeight),
      "48px",
    );
    assert.equal(
      await button.evaluate((el) => getComputedStyle(el).outlineStyle),
      "solid",
    );
    assert.equal(
      await page
        .locator("section")
        .evaluate((el) => getComputedStyle(el).borderRadius),
      "22px",
    );
  } finally {
    await page.close();
  }
});
test("Every graphic decodes and every SVG parses in a browser", async () => {
  const page = await browser.newPage();
  try {
    const assets = JSON.parse(
      fs.readFileSync("etic-ui/asset-manifest.json"),
    ).map((a) => {
      const b = fs.readFileSync("etic-ui/assets/" + a.path);
      return {
        name: a.name,
        width: a.width,
        height: a.height,
        svg: a.format === "svg" ? b.toString() : null,
        src: `data:image/${a.format === "svg" ? "svg+xml" : a.format};base64,${b.toString("base64")}`,
      };
    });
    const results = await page.evaluate(async (list) => {
      const out = [];
      for (const a of list) {
        const validXml =
          !a.svg ||
          !new DOMParser()
            .parseFromString(a.svg, "image/svg+xml")
            .querySelector("parsererror");
        const image = new Image();
        image.src = a.src;
        try {
          await image.decode();
          out.push({
            name: a.name,
            ok:
              validXml &&
              image.naturalWidth > 0 &&
              image.naturalHeight > 0 &&
              Math.abs(image.naturalWidth - a.width) <= 1 &&
              Math.abs(image.naturalHeight - a.height) <= 1,
          });
        } catch {
          out.push({ name: a.name, ok: false });
        }
      }
      return out;
    }, assets);
    assert.deepEqual(
      results.filter((r) => !r.ok),
      [],
    );
  } finally {
    await page.close();
  }
});
