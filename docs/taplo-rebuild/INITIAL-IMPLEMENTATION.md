# Initial implemented foundation

24 October 2026. Code commit e08f9d0 on claude/modest-cerf-4tont1, the same branch as Claude.

Implemented: widget text and outline-button contrast use the effective background sample rather than the stored palette; page outline buttons use the chosen wallpaper sample; transparent/solid sections reset inherited glass effects and border treatment. Shared ProfileMark renders both customer-page identity and the owner's actual-picture choices. Header visual controls appear first; details are progressively disclosed. New choices don't promote arbitrary arch shapes; saved legacy styles still render. The visual tile selection now stays in place, after screenshot review caught an animated highlight obscuring nearby choices during Undo.

Verification: six new resolver regression cases; 176 unit tests passed, 39 database-dependent tests skipped. Typecheck, targeted ESLint and production build passed. Nine browser journeys passed in macOS Chrome for Testing: seven existing header rendering/history/persistence cases and two 390/1440 actual-picture/history/reflow cases. Phone/desktop screenshots inspected. These checks exercise this change only, not the whole rebuild. The backend is a later project.

Still open: complete effective image/gradient/shader surface analysis and owner feedback; true own-content header composition previews; broader editor, booking and social configuration; purposeful customer desktop/mobile layouts; all widgets/states; UK examples bound to real PageDocs and isolated availability; whole marketing redesign and current-media capture/film pipeline. Existing examples and most marketing visuals are not yet rebuilt.

Preparation content and reviewed skills are imported alongside this work. Candidate generated images remain illustrative, with provenance. They are not evidence of real customers or jobs. Nothing here claims the full objective is complete.
