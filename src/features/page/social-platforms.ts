import { safeUrl } from "@/lib/validation";
/** One supported platform vocabulary for setup, the editor and the public renderer. */
export const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", host: "instagram.com", prefix: "" },
  { id: "facebook", label: "Facebook", host: "facebook.com", prefix: "" },
  { id: "tiktok", label: "TikTok", host: "tiktok.com", prefix: "@" },
  { id: "linkedin", label: "LinkedIn", host: "linkedin.com", prefix: "in/" },
  { id: "youtube", label: "YouTube", host: "youtube.com", prefix: "@" },
  { id: "x", label: "X", host: "x.com", prefix: "" },
  { id: "threads", label: "Threads", host: "threads.com", prefix: "@" },
  { id: "snapchat", label: "Snapchat", host: "snapchat.com", prefix: "add/" },
  { id: "pinterest", label: "Pinterest", host: "pinterest.com", prefix: "" },
  { id: "spotify", label: "Spotify", host: "open.spotify.com", prefix: "user/" },
  { id: "twitch", label: "Twitch", host: "twitch.tv", prefix: "" },
  { id: "soundcloud", label: "SoundCloud", host: "soundcloud.com", prefix: "" },
  { id: "telegram", label: "Telegram", host: "t.me", prefix: "" },
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["id"];
export const SOCIAL_IDS = SOCIAL_PLATFORMS.map((p) => p.id) as [
  SocialPlatform,
  ...SocialPlatform[],
];
export function socialUrl(
  platform: SocialPlatform,
  value: string,
): string | undefined {
  const p = SOCIAL_PLATFORMS.find((p) => p.id === platform)!;
  const v = value.trim();
  if (!v) return undefined;
  const full = /^[a-z][a-z\d+.-]*:/i.test(v)
    ? v
    : !v.startsWith("@") && (v.includes("/") || v.includes(p.host))
      ? `https://${v}`
      : `https://${p.host}/${p.prefix}${v.replace(/^@/, "")}`;
  if (!safeUrl.safeParse(full).success) return undefined;
  try {
    const url = new URL(full);
    if (url.username || url.password || url.pathname === "/") return undefined;
    const hosts = [
      p.host,
      ...(platform === "x" ? ["twitter.com"] : []),
      ...(platform === "threads" ? ["threads.net"] : []),
      ...(platform === "youtube" ? ["youtu.be"] : []),
    ];
    if (!hosts.some((h) => url.hostname === h || url.hostname === `www.${h}`))
      return undefined;
    return url.href.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}
