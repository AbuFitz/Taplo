/** Authored delivery formats. Each has a separate composition, not a crop of another movie. */
export const FILM_FORMATS = [
  { name: "taplo-intro", width: 1920, height: 1080, source: "index.html", duration: 18, sceneStarts: [0, 3, 6, 9, 12, 15], edgeColors: [[241,237,223],[232,236,204],[233,227,238],[228,230,216],[52,73,229],[20,45,62]] },
  { name: "taplo-portrait", width: 1080, height: 1920, source: "formats/portrait/index.html", duration: 18, sceneStarts: [0, 3, 6, 9, 12, 15], edgeColors: [[241,237,223],[232,236,204],[233,227,238],[228,230,216],[52,73,229],[20,45,62]] },
  { name: "taplo-square", width: 1080, height: 1080, source: "formats/square/index.html", duration: 18, sceneStarts: [0, 3, 6, 9, 12, 15], edgeColors: [[241,237,223],[232,236,204],[233,227,238],[228,230,216],[52,73,229],[20,45,62]] },
  { name: "taplo-feed", width: 1080, height: 1350, source: "formats/feed/index.html", duration: 20, sceneStarts: [0, 4, 8, 12, 16], edgeColors: [[241,237,223],[232,236,204],[233,227,238],[228,230,216],[20,45,62]] },
]
export function selectedFormats(names = process.argv.slice(2)) {
  for (const name of names) if (!FILM_FORMATS.some((f) => f.name === name)) throw new Error(`Unknown film: ${name}. Choose ${FILM_FORMATS.map((f) => f.name).join(", ")}`)
  return FILM_FORMATS.filter((f) => !names.length || names.includes(f.name))
}
