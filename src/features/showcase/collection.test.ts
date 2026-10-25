import {describe,it,expect} from 'vitest';
import {existsSync} from 'node:fs';
import {businessContentSchema} from '@/features/businesses/content';
import {pageDocSchema} from '@/features/page/contracts/page';
import {EXAMPLES} from '@/features/inspiration/examples';
import {EXAMPLE_LOOK} from './lab-state';
import {CURRENT_LOOKS,LOOKS} from '@/features/page/themes/looks';
import {exampleStart} from '@/features/inspiration/suggest';
import {hasIndustryPreset} from '@/features/themes/presets/industries';
import {COLLECTION_BRIEFS,COLLECTION_SCENARIOS} from './collection';
import {initialConfig,toPage,toContent} from './lab-state';
import {buildPageViewModel} from '@/features/page/renderer/view-model';
describe('authored business and personal design collection',()=>{
 it('provides a complete selectable design and valid page for every new identity',()=>{
  expect(CURRENT_LOOKS.length).toBe(12);expect(COLLECTION_BRIEFS.length).toBe(24);for(const look of CURRENT_LOOKS)expect(EXAMPLES.some(e=>EXAMPLE_LOOK[e.scenario]===look.id),look.id).toBe(true);
  for(const b of COLLECTION_BRIEFS){expect(LOOKS.some(l=>l.id===b.look),b.id).toBe(true);expect(hasIndustryPreset(COLLECTION_SCENARIOS[b.id].content.identity.industryKey),b.id).toBe(true);const cfg=initialConfig(b.id),page=pageDocSchema.parse(toPage(cfg)),content=businessContentSchema.parse(toContent(cfg));const vm=buildPageViewModel(content,page,{plan:'business'});expect(vm.notes.filter(n=>n.includes('could not be read')),b.id).toEqual([]);expect(new Set(page.widgets.map(w=>w.id)).size).toBe(page.widgets.length);expect(vm.visible.length,b.id).toBeGreaterThanOrEqual(3);}
 });
 it('ships the original marks and actual image sources used by each page',()=>{for(const b of COLLECTION_BRIEFS){const c=toContent(initialConfig(b.id));for(const image of [c.identity.logo,c.identity.heroImage,...c.gallery.map(g=>g.image),...c.products.map(p=>p.image)].filter(Boolean)){expect(existsSync(`public${image!.src}`),`${b.id}: ${image!.src}`).toBe(true)}expect(c.testimonials).toEqual([]);expect(c.reviewLinks).toEqual([]);}});
 it('adopts structure without fictional biography, projects, announcements or links',()=>{for(const b of COLLECTION_BRIEFS){const start=exampleStart(b.slug)!;for(const w of start.widgets){if(w.type==='text')expect(w.settings.body).toBe('');if(w.type==='image')expect(w.settings.image).toBeUndefined();if(w.type==='link')expect(w.settings.url).toBe('');}expect(start.name).toBe(b.name);}});
});
