// Original sample artwork for the fictional example businesses (marks and flat illustrations).
// Run: node scripts/marketing/illustrations.mjs   Output: public/showcase/art/*.svg
import { mkdirSync, writeFileSync } from "node:fs"
const out = new URL("../../public/showcase/art/", import.meta.url)
mkdirSync(out, { recursive: true })
const svg = (w, h, body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}${body}</svg>\n`
const files = {}

// Marks (256 square)
files["hollin-mark"] = svg(256, 256, `<circle cx="128" cy="128" r="104" fill="none" stroke="#7a2e1f" stroke-width="10"/><path d="M128 56v144M76 128h104" stroke="#7a2e1f" stroke-width="10" stroke-linecap="round"/><circle cx="128" cy="128" r="22" fill="#7a2e1f"/>`, "#f6f1e7")
files["pim-mark"] = svg(256, 256, `<path d="M52 150a76 76 0 0 1 152 0z" fill="#c4482a"/><rect x="40" y="150" width="176" height="16" rx="8" fill="#35201a"/><path d="M96 118c0-14 14-14 14-28M132 118c0-14 14-14 14-28" stroke="#fbefe3" stroke-width="8" fill="none" stroke-linecap="round"/>`, "#f3e3d3")
files["ada-mark"] = svg(256, 256, `<rect x="40" y="40" width="176" height="176" rx="40" fill="#1c7a45"/><path d="M88 176l40-96 40 96M102 148h52" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, "#e6f1e2")
files["forge-mark"] = svg(256, 256, `<path d="M40 70h176v32H40zM88 102h80v44H88zM60 146h136v40H60z" fill="#ff4d1a"/>`, "#111111")

// Café (4:5 items, 3:2 hero)
const plate = (c1, c2, extra) => svg(800, 1000, `<circle cx="400" cy="520" r="300" fill="${c1}"/><circle cx="400" cy="520" r="250" fill="${c2}"/>${extra}`, "#f3dfc9")
files["pim-hero"] = svg(1200, 800, `<rect width="1200" height="800" fill="#f0cfb4"/><rect y="560" width="1200" height="240" fill="#c4482a"/><g fill="#35201a"><rect x="140" y="250" width="14" height="320"/><rect x="1046" y="250" width="14" height="320"/></g><path d="M100 250h1000l-70-90H170z" fill="#fbefe3"/><path d="M170 160h120v90H170zM410 160h120v90H410zM650 160h120v90H650zM890 160h120v90H890z" fill="#c4482a"/><circle cx="420" cy="470" r="110" fill="#fbefe3"/><circle cx="420" cy="470" r="76" fill="#e8a46a"/><circle cx="780" cy="470" r="110" fill="#fbefe3"/><circle cx="780" cy="470" r="76" fill="#6b8f4e"/>`)
files["pim-shakshuka"] = plate("#fbefe3", "#c4482a", `<circle cx="340" cy="470" r="62" fill="#fbefe3"/><circle cx="340" cy="470" r="28" fill="#f2b632"/><circle cx="470" cy="560" r="62" fill="#fbefe3"/><circle cx="470" cy="560" r="28" fill="#f2b632"/><path d="M280 600c60 40 160 40 230 0" stroke="#6b8f4e" stroke-width="14" fill="none" stroke-linecap="round"/>`)
files["pim-flatwhite"] = plate("#fbefe3", "#8a5a3c", `<circle cx="400" cy="520" r="170" fill="#e9d1b6"/><path d="M400 390c60 40 60 100 0 140c-60-40-60-100 0-140z" fill="#fbefe3"/>`)
files["pim-cinnamon"] = plate("#fbefe3", "#e8a46a", `<circle cx="400" cy="520" r="170" fill="none" stroke="#8a4a24" stroke-width="30"/><circle cx="400" cy="520" r="100" fill="none" stroke="#8a4a24" stroke-width="30"/><circle cx="400" cy="520" r="34" fill="#8a4a24"/>`)

// Forge
files["forge-hero"] = svg(1200, 800, `<rect width="1200" height="800" fill="#1d1d1b"/><g fill="#ff4d1a"><rect x="180" y="380" width="840" height="40"/><rect x="140" y="300" width="60" height="200"/><rect x="1000" y="300" width="60" height="200"/><rect x="100" y="340" width="40" height="120"/><rect x="1060" y="340" width="40" height="120"/></g><g stroke="#3a3a36" stroke-width="6"><path d="M0 600h1200M0 640h1200M0 680h1200"/></g>`)
files["forge-class"] = svg(800, 1000, `<rect width="800" height="1000" fill="#ff4d1a"/><circle cx="400" cy="380" r="150" fill="#111"/><path d="M200 900c0-200 100-300 200-300s200 100 200 300z" fill="#111"/>`)

for (const [name, body] of Object.entries(files)) writeFileSync(new URL(`${name}.svg`, out), body)
console.log(Object.keys(files).length, "files")
