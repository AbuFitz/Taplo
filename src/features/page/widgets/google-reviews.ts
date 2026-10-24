/** Google destinations only. Saved legacy quotes/ratings never become verified Google content. */
export function isGoogleReviewUrl(value: string): boolean {
  try {
    const u = new URL(value)
    if (u.protocol !== 'https:') return false
    if (['g.page', 'maps.app.goo.gl'].includes(u.hostname)) return u.pathname.length > 1
    if (u.hostname === 'search.google.com') return u.pathname.startsWith('/local/')
    if (['google.com', 'www.google.com', 'google.co.uk', 'www.google.co.uk', 'maps.google.com', 'maps.google.co.uk'].includes(u.hostname)) return u.pathname.startsWith('/maps') || u.hostname.startsWith('maps.')
    return false
  } catch { return false }
}
export function googleReviewUrl(business: { reviewLinks?: { platform: string; url: string }[] }): string | undefined {
  return business.reviewLinks?.find(l => l.platform === 'google' && isGoogleReviewUrl(l.url))?.url
}
