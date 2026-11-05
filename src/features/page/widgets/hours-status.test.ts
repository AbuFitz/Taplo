import {describe,it,expect} from 'vitest';
import {openingStatus,openingPeriods,type HoursDay} from './HoursClient';
const hours:HoursDay[]=[{day:'mon',opens:'09:00',closes:'17:00'},{day:'tue',opens:'09:00',closes:'17:00'}];
describe('owner opening hours',()=>{
 it('shows the same-day opening before the business opens and closes exactly at its closing time',()=>{expect(openingStatus(hours,'Europe/London',Date.parse('2026-10-26T08:30:00Z'))).toMatchObject({open:false,text:'Closed now · opens today at 09:00'});expect(openingStatus(hours,'Europe/London',Date.parse('2026-10-26T09:00:00Z'))).toMatchObject({open:true,text:'Open now · closes 17:00'});expect(openingStatus(hours,'Europe/London',Date.parse('2026-10-26T17:00:00Z'))).toMatchObject({open:false,text:'Closed now · opens tomorrow at 09:00'});});
 it('uses the business timezone across daylight-saving dates, rather than the visitor timezone',()=>{const instant=Date.parse('2026-10-19T08:30:00Z');expect(openingStatus(hours,'Europe/London',instant).open).toBe(true);expect(openingStatus(hours,'America/New_York',instant).open).toBe(false);});
 it('does not manufacture availability when no hours are set',()=>expect(openingStatus([],'Europe/London',Date.parse('2026-10-26T10:00:00Z'))).toMatchObject({open:false,text:'Closed now'}));
});

const split: HoursDay[] = [
 {day:'mon',opens:'17:00',closes:'19:00'},
 {day:'mon',opens:'10:00',closes:'16:00'},
 {day:'tue',opens:'08:00',closes:'12:00'},
];
describe('split public hours',()=>{
 it.each([
  ['09:00','Closed now · opens today at 10:00',false],
  ['10:00','Open now · closes 16:00',true],
  ['16:00','Closed now · opens today at 17:00',false],
  ['16:59','Closed now · opens today at 17:00',false],
  ['17:00','Open now · closes 19:00',true],
  ['19:00','Closed now · opens tomorrow at 08:00',false],
 ])('uses every period at %s',(time,text,open)=>expect(openingStatus(split,'Europe/London',Date.parse(`2026-10-26T${time}:00Z`))).toMatchObject({text,open}));
 it('retains both periods in display order without mutating merchant records',()=>{
  expect(openingPeriods(split,'mon')).toEqual([{opens:'10:00',closes:'16:00'},{opens:'17:00',closes:'19:00'}]);
  expect(split[0].opens).toBe('17:00');
 });
 it('finds next week when the last period of the only opening day has ended',()=>expect(openingStatus(split.slice(0,2),'Europe/London',Date.parse('2026-10-26T19:00:00Z')).text).toBe('Closed now · opens Mon at 10:00'));
 it('merges adjacent and overlapping legacy periods so it does not announce a false closing',()=>{
  const overlapping:HoursDay[]=[{day:'mon',opens:'09:00',closes:'12:00'},{day:'mon',opens:'11:00',closes:'14:00'},{day:'mon',opens:'14:00',closes:'17:00'}];
  expect(openingStatus(overlapping,'Europe/London',Date.parse('2026-10-26T11:30:00Z')).text).toBe('Open now · closes 17:00');
 });
 it('ignores invalid legacy periods',()=>expect(openingPeriods([{day:'mon',opens:'29:00',closes:'30:00'},{day:'mon',opens:'17:00',closes:'09:00'},{day:'mon'}],'mon')).toEqual([]));
 it('shows a neutral fallback for invalid timezones rather than guessing or crashing',()=>expect(openingStatus(split,'Invalid/Zone',Date.now())).toEqual({today:'',open:false,text:'See opening hours'}));
 it('evaluates split periods in the business timezone',()=>expect(openingStatus(split,'America/New_York',Date.parse('2026-10-26T21:00:00Z')).text).toBe('Open now · closes 19:00'));
});
