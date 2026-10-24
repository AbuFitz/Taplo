import { describe, expect, it } from 'vitest'
import { googleReviewUrl, isGoogleReviewUrl } from './google-reviews'
import { buildPageViewModel } from '../renderer/view-model'
import { initialConfig, toContent, toPage } from '@/features/showcase/lab-state'
import { newWidget } from '../starter'

describe('Google-only reviews', () => {
  it('accepts supported Google destinations and rejects other sites or lookalike domains', () => {
    for (const url of ['https://www.google.com/maps/place/Example', 'https://g.page/example/review', 'https://maps.app.goo.gl/example', 'https://search.google.com/local/writereview?placeid=example']) expect(isGoogleReviewUrl(url), url).toBe(true)
    for (const url of ['https://google.com.evil.example/maps', 'https://facebook.com/example', 'http://google.com/maps', 'javascript:alert(1)', 'https://example.com']) expect(isGoogleReviewUrl(url), url).toBe(false)
  })
  it('never treats legacy quotes, manually entered ratings or another platform as Google reviews', () => {
    const cfg = initialConfig('station'), content = toContent(cfg)
    const page = { ...toPage(cfg), widgets: [newWidget('reviews'), newWidget('leaveReview')] }
    content.reviewLinks = [{ platform: 'facebook', url: 'https://facebook.com/example' }]
    const before = JSON.stringify(content)
    expect(googleReviewUrl(content)).toBeUndefined()
    expect(buildPageViewModel(content, page, { plan: 'business' }).visible).toHaveLength(0)
    expect(JSON.stringify(content)).toBe(before)
    content.reviewLinks.push({ platform: 'google', url: 'https://www.google.com/maps/place/Example' })
    expect(buildPageViewModel(content, page, { plan: 'business' }).visible.map(w => w.type)).toEqual(['reviews', 'leaveReview'])
    expect(buildPageViewModel(content, page, { plan: 'free' }).visible).toHaveLength(0)
  })
})
