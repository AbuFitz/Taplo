// Renders the three directions: hero comps (HTML), the real editor and the real customer page under each direction's tokens.
import { chromium } from "@playwright/test"
import { mkdirSync, readFileSync } from "node:fs"
const base = process.env.BASE_URL ?? "http://localhost:3000"
const out = "/home/user/taplo/docs/directions/"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const D = {
  a: { editorCss: readFileSync(out + "tokens-a.css", "utf8"), look: { colors: { background: "#0a1020", text: "#f4f6ff", muted: "#a9b2d0", surface: "#121a33", accent: "#2f4bff", accentText: "#ffffff", border: "#26305a" }, text: { headingFont: "geist", bodyFont: "geist", headingWeight: "bold" }, header: { layout: "poster", avatarShape: "square", avatarSize: "sm", align: "left", actions: "primary", scrim: "strong" }, buttons: { shape: "square", fill: "solid", shadow: "none", showIcons: true }, cards: { surface: "solid", radius: "sm", border: "thin", shadow: "none", padding: "comfortable" }, layout: { width: "regular", density: "comfortable", desktop: "centered" }, background: { kind: "solid", color: "#0a1020" } } },
  b: { editorCss: readFileSync(out + "tokens-b.css", "utf8"), look: { colors: { background: "#f5f7fa", text: "#0b1220", muted: "#5a6478", surface: "#ffffff", accent: "#1230ff", accentText: "#ffffff", border: "#dde2ea" }, text: { headingFont: "inter", bodyFont: "inter", headingWeight: "bold" }, header: { layout: "centered", avatarShape: "logo", avatarSize: "md", align: "center", actions: "primary", scrim: "soft" }, buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true }, cards: { surface: "solid", radius: "md", border: "thin", shadow: "none", padding: "comfortable" }, layout: { width: "regular", density: "comfortable", desktop: "centered" }, background: { kind: "solid", color: "#f5f7fa" } } },
  c: { editorCss: readFileSync(out + "tokens-c.css", "utf8"), look: { colors: { background: "#e8ecf2", text: "#0e1522", muted: "#4f5b6e", surface: "#f6f8fb", accent: "#5a3cf0", accentText: "#ffffff", border: "#cfd6e2" }, text: { headingFont: "instrumentSerif", bodyFont: "inter", headingWeight: "regular", size: "lg" }, header: { layout: "cover", avatarShape: "square", avatarSize: "md", align: "left", actions: "primary", scrim: "medium" }, buttons: { shape: "square", fill: "solid", shadow: "none", showIcons: false }, cards: { surface: "transparent", radius: "none", border: "thin", shadow: "none", padding: "roomy" }, layout: { width: "regular", density: "comfortable", desktop: "centered" }, background: { kind: "solid", color: "#e8ecf2" } } },
}
for (const [d, cfg] of Object.entries(D)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
  const p = await ctx.newPage()
  await p.goto(`file://${out}hero-${d}.html`); await p.waitForTimeout(800); await p.screenshot({ path: `${out}${d}-hero.png` })
  // The real editor
  await p.goto(base + "/dashboard", { waitUntil: "load" }); await p.evaluate(() => localStorage.clear()); await p.goto(base + "/dashboard", { waitUntil: "load" })
  await p.getByText("More sample businesses", { exact: true }).click(); await p.getByRole("button", { name: /^Barber/ }).first().click(); await p.waitForURL(/dashboard\/page/); await p.waitForLoadState("networkidle").catch(() => {}); await p.waitForTimeout(1200)
  await p.addStyleTag({ content: cfg.editorCss }); await p.waitForTimeout(500); await p.screenshot({ path: `${out}${d}-editor.png` })
  await ctx.close()
  // The real customer page: phone and desktop, same look
  const o = encodeURIComponent(JSON.stringify(cfg.look))
  for (const [tag, w, h] of [["phone", 390, 844], ["desk", 1280, 800]]) {
    const c2 = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === "phone" ? 2 : 1, reducedMotion: "reduce" })
    const q = await c2.newPage(); await q.goto(`${base}/appearance/frame?scenario=barber&o=${o}`, { waitUntil: "load" }); await q.waitForLoadState("networkidle").catch(() => {}); await q.waitForTimeout(1200)
    await q.screenshot({ path: `${out}${d}-page-${tag}.png` }); await c2.close()
  }
  console.log(d)
}
await b.close()
