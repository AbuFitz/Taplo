# Image delivery, measured mobile performance and native browser coverage

The homepage opening now gives its actual LCP photograph high fetch priority. Real renderer screenshots use responsive Next image derivatives, with explicit sizes for the small hero/business previews; their original capture files and crops remain intact. Brand SVGs have dimensions matching their real viewBoxes. The film poster uses separate portrait/landscape responsive artwork and loads lazily, while the MP4 remains voluntary. Its native button name now comes from its visible Play,18seconds text; the home accessibility scan explicitly includes WCAG2.1A label checks.

## Measured change

Three retained Lighthouse13.5.0 mobile runs use the same compiled-local-server settings:412×823/1.75DPR,150ms RTT,1638.4Kbps and4× CPU simulation, browser storage reset. No other browser jobs ran during each measurement. This is a workstation lab comparison, not field traffic or a physical Android device. Server image caches and normal run variation limit generalization.

| Run | Performance | LCP | Transferred bytes |
| --- | --- | --- | --- |
| home-mobile | 83 | 4.7 s | 961001 |
| home-mobile-after-images | 85 | 4.3 s | 690299 |
| home-mobile-after-poster | 91 | 3.5 s | 553969 |

All three runs score100 in the accessibility, best-practices and SEO categories, but those aggregate scores do not erase unweighted failures: the original film-label mismatch and missing image dimensions were inspected and corrected explicitly. Final LCP discovery and intrinsic-dimensions audits pass. TBT is10ms and CLS0.001 in the final run. The two film formats and the six real UK examples retain their actual content and visual composition; reviewed phone/desktop output and native film checks verify delivery rather than relying only on scores. LCP3.5s still has room to improve; do not claim a sub2.5s field result.

The full JSON/standalone HTML reports and browser-engines.json are in the delivery package's performance directory. Method reference: https://developer.chrome.com/docs/lighthouse/overview.

## Browser verification

playwright.cross-browser.config.ts runs the new representative journeys in installed Firefox and WebKit. It inherits the local server setup while deliberately clearing the Chromium-only executable override. Install their binaries with npx playwright install firefox webkit, then run BASE_URL=http://localhost:3100 npx playwright test --config=playwright.cross-browser.config.ts. No application dependency was added.

Three complete case groups at390/1440 exercise: marketing images/native MP4 start/responsive design preview; contextual home-repair request through stored pending outcome and actual From£65 price; owner look change/undo/reload with records/widget structure preserved. Firefox and WebKit pass12/12; the same new cases pass6/6 in Chromium. Actual engine versions are recorded in browser-engines.json. These are browser engines on the development Mac at phone/desktop widths, not a Safari-app or physical-device claim.

Final affected Chromium marketing/home/product/gallery suite passes81/81, including current imagery/crops, broader WCAG2.1A checks, navigation and both native film formats. Production build, TypeScript and targeted lint pass. Byte-identical duplicate generated route typings were removed locally when they reappeared; no source suppression was introduced.

## Remaining work

The broad engine/widget/migration ledger, explicit missing workbench states, service detail simplification, older remaining examples and full design/stock tutorials remain in scope. Measure the actual customer page/editor under representative mobile conditions as well. Browser coverage is now wider, but manual screen-reader/zoom/physical-device evidence is still bounded. Full frontend goal remains active.
