/** Real, paced browser recordings. Captions sit outside an unchanged product iframe.
 * BASE_URL=http://localhost:3100 CHROME_PATH=... HYPERFRAMES_FFMPEG_PATH=... node scripts/marketing/record-walkthroughs.mjs [setup booking]
 * Each recording uses a fresh browser store. No external customers, publishing or payments. */
import { chromium, expect } from "@playwright/test"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const base = process.env.BASE_URL ?? "http://localhost:3100"
const output = fileURLToPath(new URL("../../public/marketing/walkthroughs/", import.meta.url))
const raw = fileURLToPath(new URL("../../.cache/walkthroughs/", import.meta.url))
await mkdir(output, { recursive: true }); await mkdir(raw, { recursive: true })
const selected = process.argv.slice(2)
for (const name of selected) if (!["setup", "booking"].includes(name)) throw new Error(`Unknown walkthrough: ${name}`)
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const manifestPath = `${output}manifest.json`
const manifest = JSON.parse(await readFile(manifestPath, "utf8").catch(() => "{}"))
const recordings = {
  setup: { title: "Make your first page", path: "/onboarding?from=no-6-coffee", async run(f, step, pause) {
    await step("Start with your identity", "Your name and logo, with a crop you approve before it is added.")
    await f.getByLabel("Business name", { exact: true }).pressSequentially("No. 6 Coffee", { delay: 95 })
    const buffer=await sharp(await readFile(new URL("../../public/taplo-demo/corner-table-mark.svg",import.meta.url))).png().toBuffer()
    await f.getByLabel("Add your logo or profile photo: upload a picture").setInputFiles({name:"no-6.png",mimeType:"image/png",buffer})
    await f.getByTestId("crop-dialog").waitFor();await pause(1700)
    await f.getByTestId("crop-dialog").getByRole("button",{name:"Use image",exact:true}).click()
    await f.getByLabel("Short description (optional)",{exact:true}).fill("Coffee, breakfast and lunch.")
    await f.getByRole("button",{name:"Add a cover photo",exact:true}).click()
    await f.getByLabel("Cover photo (optional): upload a picture").setInputFiles(new URL("../../public/photography/coffee.webp",import.meta.url).pathname)
    await f.getByTestId("crop-dialog").getByRole("button",{name:"Use image",exact:true}).click()
    await f.getByRole("button",{name:"Done",exact:true}).click();await pause(1000)
    await f.getByRole("button", { name: "Continue", exact: true }).click()
    await step("Say what you do", "Search for your business. Keep the setup relevant.")
    await f.getByLabel("Search businesses").pressSequentially("cafe",{delay:130});await pause(1400)
    await f.getByRole("list",{name:"Kinds of business"}).getByRole("button",{name:"Cafe / restaurant",exact:true}).click()
    await f.getByRole("button", { name: "Continue", exact: true }).click()
    await step("Choose how people reach you", "A call fits this café. The menu does not need appointment bookings.")
    await f.getByRole("button",{name:"Phone calls",exact:true}).click()
    await f.getByLabel("Phone", { exact: true }).pressSequentially("01632 960123", { delay: 95 });await pause(1500)
    await f.getByRole("button", { name: "Continue", exact: true }).click()
    await step("Add something customers can buy", "A simple menu item and its price. No sample business records are copied.")
    await f.getByLabel("Service 1 name").pressSequentially("Flat white",{delay:120});await f.getByLabel("Service 1 price").fill("3.40");await pause(2000)
    await step("Add the practical details", "Your description, location, hours and links live in a focused popup.")
    await f.getByRole("button",{name:/Business details/}).click();const details=f.getByTestId("setup-business-details")
    await details.getByLabel("Town or area",{exact:true}).fill("St Albans")
    await details.getByLabel("Monday",{exact:true}).check();await details.getByLabel("Tuesday",{exact:true}).check();await pause(1800)
    await details.getByRole("button",{name:"Save details",exact:true}).click()
    await f.getByRole("button", { name: "Continue", exact: true }).click()
    await step("Make the page yours", "Choose a layout, then adjust the background and profile separately.")
    await f.getByRole("button",{name:/Background & colours/}).click();await f.getByTestId("setup-design-dialog").getByRole("button",{name:"Silver gradient",exact:true}).click();await pause(1800)
    await f.getByRole("button",{name:"Done",exact:true}).click()
    await f.getByTestId("setup-profile-choices").getByRole("radio",{name:"Photo",exact:true}).check();await pause(2000)
    await f.getByRole("button", { name: "Continue", exact: true }).click()
    await step("Choose room to grow", "Compare the plans and save a preference. No payment is taken.")
    await f.getByRole("radio",{name:"Choose Core",exact:true}).check();await f.locator(".plan-experience button").click();await pause(1800);await f.getByRole("button",{name:"Keep Core",exact:true}).click();await pause(600)
    await f.getByRole("button",{name:"Continue",exact:true}).click()
    await step("Review the actual page", "Check the menu, contact details and opening hours before continuing.")
    await expect(f.getByRole("heading",{name:"Review your page",exact:true})).toBeVisible()
    await pause(2000)
    await f.getByRole("button",{name:"Customise my page",exact:true}).click();await expect(f.getByTestId("my-page")).toBeVisible()
    await step("Keep making it yours", "Your draft is saved in this browser. Publishing and billing are not connected.")
    await f.getByTestId("customer-preview").click();await pause(3500)
    const state=await f.locator("body").evaluate(()=>JSON.parse(localStorage.getItem("taplo.demo.v2")))
    expect(state.content.identity.name).toBe("No. 6 Coffee");expect(state.content.services[0]).toMatchObject({name:"Flat white",priceMinor:340})
    return {name:state.content.identity.name,service:state.content.services[0].name,storage:"browser-only"}
  } },
  booking: { title: "From a service to a booking", path: "/appearance/frame?scenario=station", async run(f, step, pause) {
    await step("Start with the service", "See the actual price and what the haircut includes.")
    await f.getByTestId("service-open").filter({ hasText: "Haircut" }).first().scrollIntoViewIfNeeded(); await pause(2300)
    await f.getByTestId("service-open").filter({ hasText: "Haircut" }).first().click()
    const detail = f.getByTestId("service-detail")
    await expect(detail).toContainText("£22"); await pause(3000)
    await detail.getByRole("button", { name: "Book this", exact: true }).click()
    const flow = f.getByTestId("booking-flow")
    await step("Choose who you see", "Pick a barber, or use anyone available.")
    await flow.getByRole("button", { name: /Anyone available/ }).waitFor(); await pause(2000)
    await flow.getByRole("button", { name: /Anyone available/ }).click()
    await step("Find a time", "Choose from the working preview calendar.")
    await flow.getByTestId("bk-slot").first().waitFor(); await pause(1800)
    await flow.getByTestId("bk-slot").first().click(); await pause(1500)
    await flow.getByRole("button", { name: /^Book this time/ }).click()
    await step("Leave your details", "A name and email. No payment is taken here.")
    await flow.getByLabel("Your name", { exact: true }).pressSequentially("Sam Taylor", { delay: 100 })
    await flow.getByLabel("Email", { exact: true }).pressSequentially("sam@example.com", { delay: 75 }); await pause(1400)
    await flow.getByRole("button", { name: "Review", exact: true }).click()
    await step("Check before confirming", "The service, person, time and price are together.")
    await expect(flow.getByTestId("bk-outcome")).toBeVisible(); await pause(4000)
    await flow.getByRole("button", { name: "Confirm booking", exact: true }).click()
    await expect(flow.getByTestId("bk-done")).toHaveAttribute("data-status", "confirmed")
    await step("See the actual outcome", "This example booking is saved only in this browser."); await pause(4500)
    const saved = await f.locator("body").evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.bookings.v1:common-room-barbers")))
    expect(saved.bookings[0]).toMatchObject({ serviceName: "Haircut", status: "confirmed" })
    return { service: saved.bookings[0].serviceName, status: saved.bookings[0].status, storage: "browser-only" }
  } },
}
try {
  for (const [id, job] of Object.entries(recordings).filter(([id]) => !selected.length || selected.includes(id))) {
    const context = await browser.newContext({ viewport: { width: 390, height: 964 }, deviceScaleFactor: 1, reducedMotion: "reduce", recordVideo: { dir: raw, size: { width: 390, height: 964 } } })
    const page = await context.newPage(), created = Date.now(), errors = [], chapters = []
    page.on("pageerror", e => errors.push(e.message))
    await context.route(`${base}/__walkthrough`, r => r.fulfill({ contentType: "text/html", body: `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#080808;font-family:Arial,sans-serif}header{height:120px;padding:16px 20px;color:#fff}header small{display:flex;justify-content:space-between;color:#cccccc;font-size:11px;letter-spacing:1px;font-weight:700}h1{font-size:22px;line-height:1.13;letter-spacing:-.5px;margin:9px 0 5px}p{font-size:13px;line-height:1.3;margin:0;color:#cccccc}iframe{display:block;width:390px;height:844px;border:0;background:#fff}</style></head><body><header><small><span>TAPLO · ${job.title.toUpperCase()}</span><span id="number">1 / 6</span></small><h1 id="caption">${job.title}</h1><p id="line">A real product walkthrough · illustrative business</p></header><iframe title="Actual Taplo interface" src="${job.path}"></iframe></body></html>` }))
    await page.goto(`${base}/__walkthrough`)
    const f = page.frameLocator("iframe"), video = page.video()
    await f.locator("body").waitFor(); await page.waitForTimeout(1200)
    const started = Date.now()
    const pause = ms => page.waitForTimeout(ms)
    const step = async (title, line) => {
      console.log(id, title)
      chapters.push({ seconds: Math.round((Date.now() - started) / 100) / 10, title, line })
      await page.evaluate(({ title, line, n, total }) => { document.querySelector("#caption").textContent = title; document.querySelector("#line").textContent = line; document.querySelector("#number").textContent = `${n} / ${total}` }, { title, line, n: chapters.length, total: id === "setup" ? 9 : 6 })
      await pause(650)
    }
    let outcome, poster
    try {
      outcome = await job.run(f, step, pause)
      if (errors.length) throw new Error(errors.join("\n"))
      poster = await page.screenshot({ type: "png" })
    } catch (error) { await page.screenshot({ path: `${raw}${id}-failure.png` }); throw error } finally { await context.close() }
    const source = await video.path(), file = `${output}${id}.mp4`
    const encoded = spawnSync(process.env.HYPERFRAMES_FFMPEG_PATH ?? "ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", String((started - created) / 1000), "-i", source, "-an", "-vf", "scale=780:1928:flags=lanczos,fps=25", "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", file], { encoding: "utf8" })
    if (encoded.status !== 0) throw new Error(encoded.stderr)
    const probe = spawnSync(process.env.HYPERFRAMES_FFPROBE_PATH ?? "ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", file], { encoding: "utf8" })
    let media;
    if (probe.status === 0) media = JSON.parse(probe.stdout);
    else if (probe.error?.code === "ENOENT") {
      // The bundled encoder may be installed without the separate ffprobe
      // executable. Its decoded stream metadata is the fallback evidence.
      const decodedProbe = spawnSync(process.env.HYPERFRAMES_FFMPEG_PATH ?? "ffmpeg", ["-hide_banner", "-i", file, "-f", "null", "-"], { encoding: "utf8" });
      if (decodedProbe.status !== 0) throw new Error(decodedProbe.stderr);
      const text = decodedProbe.stderr;
      const duration = text.match(/Duration: (\d+):(\d+):([\d.]+)/);
      const video = text.match(/Video: (\w+)[^\n]*? (\d{2,5})x(\d{2,5})[^\n]*? (\d+(?:\.\d+)?) fps/);
      if (!duration || !video) throw new Error("Could not verify decoded recording metadata");
      media = { format: { duration: String(Number(duration[1])*3600+Number(duration[2])*60+Number(duration[3])) }, streams: [
        { codec_type: "video", codec_name: video[1], width: Number(video[2]), height: Number(video[3]), avg_frame_rate: `${video[4]}/1` },
        ...(/Stream .*Audio:/.test(text) ? [{ codec_type: "audio" }] : []),
      ] };
    } else throw new Error(probe.stderr || probe.error?.message);
    const stream = media.streams.find(s => s.codec_type === "video");
    if (stream.width !== 780 || stream.height !== 1928 || stream.codec_name !== "h264" || media.streams.some(s => s.codec_type === "audio")) throw new Error(`Invalid output: ${id}`)
    const decoded = spawnSync(process.env.HYPERFRAMES_FFMPEG_PATH ?? "ffmpeg", ["-v", "error", "-i", file, "-f", "null", "-"], { encoding: "utf8" })
    if (decoded.status !== 0 || decoded.stderr.trim()) throw new Error(decoded.stderr)
    await sharp(poster).resize(780, 1928).webp({ quality: 88 }).toFile(`${output}${id}-poster.webp`)
    const bytes = await readFile(file)
    manifest[id] = { title: job.title, file: `/marketing/walkthroughs/${id}.mp4`, poster: `/marketing/walkthroughs/${id}-poster.webp`, width: 780, height: 1928, duration: Number(media.format.duration), fps: stream.avg_frame_rate, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), recordedAt: new Date().toISOString(), source: job.path, chapters, outcome }
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
    console.log(id, `${media.format.duration}s`, `${bytes.length} bytes`, JSON.stringify(outcome))
  }
} finally { await browser.close() }
