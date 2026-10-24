import {describe,it,expect} from 'vitest';
import {openingStatus,type HoursDay} from './HoursClient';
const hours:HoursDay[]=[{day:'mon',opens:'09:00',closes:'17:00'},{day:'tue',opens:'09:00',closes:'17:00'}];
describe('owner opening hours',()=>{
 it('shows the same-day opening before the business opens and closes exactly at its closing time',()=>{expect(openingStatus(hours,'Europe/London',Date.parse('2026-10-26T08:30:00Z'))).toMatchObject({open:false,text:'Closed now · opens today at 09:00'});expect(openingStatus(hours,'Europe/London',Date.parse('2026-10-26T09:00:00Z'))).toMatchObject({open:true,text:'Open now · closes 17:00'});expect(openingStatus(hours,'Europe/London',Date.parse('2026-10-26T17:00:00Z'))).toMatchObject({open:false,text:'Closed now · opens tomorrow at 09:00'});});
 it('uses the business timezone across daylight-saving dates, rather than the visitor timezone',()=>{const instant=Date.parse('2026-10-19T08:30:00Z');expect(openingStatus(hours,'Europe/London',instant).open).toBe(true);expect(openingStatus(hours,'America/New_York',instant).open).toBe(false);});
 it('does not manufacture availability when no hours are set',()=>expect(openingStatus([],'Europe/London',Date.parse('2026-10-26T10:00:00Z'))).toMatchObject({open:false,text:'Closed now'}));
});
