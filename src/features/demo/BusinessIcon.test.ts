import {describe,it,expect} from 'vitest';
import {INDUSTRY_PRESETS} from '@/features/themes/presets/industries';
import {BUSINESS_ICONS} from './BusinessIcon';
describe('business symbol coverage',()=>{it('uses an explicit maintained icon for every supported business',()=>{expect(INDUSTRY_PRESETS.filter(p=>!BUSINESS_ICONS[p.id]).map(p=>p.id)).toEqual([])});});
