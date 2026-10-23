import type { ImageRef } from "@/features/businesses/content"
import type { StyleSpec } from "../contracts/style"
import { initialsOf } from "@/lib/validation"
import { ProfileImage } from "./ProfileImage"

/** The same image treatment in the page and the owner's visual picker. */
export function ProfileMark({ image, name, shape, size = "md", priority = false }: {
  image?: ImageRef
  name: string
  shape: StyleSpec["header"]["avatarShape"]
  size?: StyleSpec["header"]["avatarSize"]
  priority?: boolean
}) {
  if (shape === "none") return null
  const wide = image?.width && image?.height ? image.width / image.height > 1.5 : false
  if (image && (shape === "logo" || wide)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="tp-logo" data-size={size} src={image.src} alt={image.alt} width={image.width} height={image.height} />
  }
  return <span className="tp-avatar" data-shape={shape} data-size={size}>
    {image ? <ProfileImage image={image} sizes="160px" priority={priority} /> : <span aria-hidden="true">{initialsOf(name)}</span>}
  </span>
}
