import { readFileSync } from "node:fs"
import { join } from "node:path"
import { qrSvg } from "./render"

/** Server-side: the Taplo code (Taplo mark centred, Taplo ink on white) for static artwork. The browser builds the same one for sharing. */
const MARK = `data:image/svg+xml;base64,${readFileSync(join(process.cwd(), "public/logo/taplo-symbol-black-tight.svg")).toString("base64")}`
export const taploCodeSvg = (url: string, px: number, label?: string) =>
  qrSvg(url, { dots: "rounded", corners: "rounded", fg: "#12141a", bg: "#ffffff", logo: { href: MARK, aspect: 577 / 526 } }, px, label)
