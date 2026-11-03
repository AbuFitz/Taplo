/** Authored delivery formats. Each has a separate composition, not a crop of another movie. */
export const FILM_FORMATS = [
  { name: "taplo-intro", width: 1920, height: 1080, source: "three-landscape.html", duration: 18, sceneStarts: [0, 3, 6, 10, 14] },
  { name: "taplo-portrait", width: 1080, height: 1920, source: "three-portrait.html", duration: 18, sceneStarts: [0, 3, 6, 10, 14] },
  { name: "taplo-square", width: 1080, height: 1080, source: "three-square.html", duration: 18, sceneStarts: [0, 3, 6, 10, 14] },
  { name: "taplo-feed", width: 1080, height: 1350, source: "three-feed.html", duration: 20, sceneStarts: [0, 3.333333, 6.666667, 11.111111, 15.555556] },
]
export function selectedFormats(names = process.argv.slice(2)) {
  for (const name of names) if (!FILM_FORMATS.some((f) => f.name === name)) throw new Error(`Unknown film: ${name}. Choose ${FILM_FORMATS.map((f) => f.name).join(", ")}`)
  return FILM_FORMATS.filter((f) => !names.length || names.includes(f.name))
}
