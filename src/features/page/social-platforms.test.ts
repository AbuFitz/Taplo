import {describe,it,expect} from 'vitest';
import {socialUrl,SOCIAL_PLATFORMS} from './social-platforms';
describe('social profile normalization',()=>{
 it('keeps supported profile hosts and genuine brand usernames',()=>{expect(socialUrl('instagram','@north.street')).toBe('https://instagram.com/north.street');expect(socialUrl('tiktok','@northstreet')).toBe('https://tiktok.com/@northstreet');expect(socialUrl('linkedin','https://www.linkedin.com/company/north-street')).toBe('https://www.linkedin.com/company/north-street');expect(socialUrl('x','https://twitter.com/northstreet')).toBe('https://twitter.com/northstreet');expect(socialUrl('spotify','northstreet')).toBe('https://open.spotify.com/user/northstreet');});
 it('rejects scripts, embedded credentials and unrelated hosts',()=>{for(const value of ['javascript:alert(1)','https://instagram.com.attacker.test/a','https://instagram.com@attacker.test/a'])expect(socialUrl('instagram',value)).toBeUndefined();});
 it('supports every picker platform without dropping records',()=>{for(const p of SOCIAL_PLATFORMS)expect(socialUrl(p.id,`https://${p.host}/northstreet`)).toContain(p.host)});
});
