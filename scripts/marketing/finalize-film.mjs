/** Validate delivered videos, create posters/short feature cuts and record exact source/output hashes. */
import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { createHash } from "node:crypto"
import sharp from "sharp"
import { FILM_FORMATS } from "./film-formats.mjs"
const ffmpeg = process.env.HYPERFRAMES_FFMPEG_PATH ?? "ffmpeg"
const ffprobe = process.env.HYPERFRAMES_FFPROBE_PATH ?? "ffprobe"
const root = new URL("../../", import.meta.url)
const file = p => new URL(p, root).pathname
const outputs = FILM_FORMATS.map((f) => ({ ...f }))
for (const [name, at] of [["booking", 3], ["design", 6], ["stock", 10]]) {
  execFileSync(ffmpeg, ["-y", "-ss", String(at), "-i", file("public/marketing/film/taplo-intro.mp4"), "-t", "3", "-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", file(`public/marketing/film/${name}-clip.mp4`)], { stdio: ["ignore", "ignore", "pipe"] })
  outputs.push({ name: `${name}-clip`, width: 1920, height: 1080, source: `taplo-intro.mp4#t=${at},${at+3}`, duration: 3 })
}
const manifest = []
for (const out of outputs) {
  const path = `public/marketing/film/${out.name}.mp4`
  const info = JSON.parse(execFileSync(ffprobe, ["-v", "error", "-show_streams", "-show_format", "-of", "json", file(path)], { encoding: "utf8" }))
  const video = info.streams.find(s => s.codec_type === "video")
  // FFprobe names full-range 8-bit 4:2:0 yuvj420p; both ranges are valid deliveries.
  if (!video || video.r_frame_rate !== "30/1" || video.codec_name !== "h264" || !["yuv420p", "yuvj420p"].includes(video.pix_fmt) || Number(video.nb_frames) !== out.duration * 30 || video.width !== out.width || video.height !== out.height || Math.abs(Number(info.format.duration) - out.duration) > 0.1 || info.streams.some(s => s.codec_type === "audio")) throw new Error(`Unexpected delivery format: ${out.name}`)
  if (out.edgeColors) {
    // Actual exported-frame check: catches a render wrapper clipping the scene and exposing the body below it.
    for (const [i, start] of out.sceneStarts.entries()) {
      const at = start + 1
      const rgb = out.edgeColors[i]
      const image = execFileSync(ffmpeg, ["-v", "error", "-ss", String(at), "-i", file(path), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "pipe:1"], { maxBuffer: 20_000_000 })
      const pixel = await sharp(image).extract({ left:2, top:out.height-3, width:1, height:1 }).removeAlpha().raw().toBuffer()
      if (rgb.some((channel,n) => Math.abs(channel-pixel[n]) > 8)) throw new Error(`Exported scene does not fill canvas: ${out.name} at ${at}s (${[...pixel]})`)
    }
  }
  // Decode every frame too: metadata and a few settled frames cannot detect a broken middle.
  execFileSync(ffmpeg, ["-v", "error", "-i", file(path), "-f", "null", "-"], { stdio: ["ignore", "ignore", "pipe"] })
  const bytes = readFileSync(file(path))
  const png = execFileSync(ffmpeg, ["-v", "error", "-ss", "1", "-i", file(path), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "pipe:1"], { maxBuffer: 20_000_000 })
  await sharp(png).webp({ quality: 90 }).toFile(file(`public/marketing/film/${out.name === "taplo-intro" ? "poster" : out.name + "-poster"}.webp`))
  manifest.push({ ...out, fps: video.r_frame_rate, codec: video.codec_name, pixelFormat: video.pix_fmt, frames: Number(video.nb_frames), bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), sourceSha256: out.source.endsWith("html") ? createHash("sha256").update(readFileSync(file(`marketing/film/${out.source}`))).digest("hex") : null })
}
writeFileSync(file("public/marketing/film/manifest.json"), JSON.stringify({ renderer: "Authored Three.js device geometry, lighting and camera motion; deterministic Playwright rendering and FFmpeg encoding", description: "Silent 3D product films; fictional UK businesses; actual shared-renderer pages mapped onto authored device geometry.", sourceSceneSha256: createHash("sha256").update(readFileSync(file("marketing/film/assets/three-scene.js"))).digest("hex"), threeVersion: JSON.parse(readFileSync(file("node_modules/three/package.json"), "utf8")).version, sourceInputs: Object.fromEntries(["station.webp","detailer.webp","dealer.webp","desktop.webp","booking.webp","display.woff2","body.woff2"].map(name => [name, createHash("sha256").update(readFileSync(file("marketing/film/assets/three/" + name))).digest("hex")])), outputs: manifest }, null, 2) + "\n")
console.log(manifest.map(x=>`${x.name}: ${x.width}×${x.height}, ${x.duration}s, ${Math.round(x.bytes/1024)} KB`).join("\n"))
