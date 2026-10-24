import { expect, it } from 'vitest'
import { resolveStyle } from './themes/resolve'
import { contrastRatio, mix } from './themes/color'
it('linked gradients follow replacement logos, preserve neutral marks and keep text readable throughout the background', () => {
  for (const look of ['silver','smoke']) {
    const neutral = resolveStyle(look)
    const first = resolveStyle(look, {}, '#ee3311')
    const replacement = resolveStyle(look, {}, '#16734b')
    expect(first.spec.background).not.toEqual(replacement.spec.background)
    expect(resolveStyle(look, {}, undefined).spec.background).toEqual(neutral.spec.background)
    for (const style of [neutral,first,replacement]) {
      const bg=style.spec.background
      expect(bg.kind).toBe('gradient')
      if(bg.kind==='gradient')for(let t=0;t<=1;t+=.1) expect(contrastRatio(style.spec.colors.text,mix(bg.from,bg.to,t))).toBeGreaterThanOrEqual(4.5)
    }
  }
})
it('manual gradients and deliberately chosen accents remain independent of a replacement logo', () => {
  const manual={background:{kind:'gradient' as const,from:'#ffffff',to:'#eeeeee',angle:90,motion:true,source:'manual' as const}}
  expect(resolveStyle('silver',manual,'#ee3311').spec.background).toEqual(manual.background)
  expect(resolveStyle('silver',{colors:{accent:'#123456'}},'#ee3311').spec.colors.accent).toBe('#123456')
})
