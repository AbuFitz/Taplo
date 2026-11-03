# 54 · Mobile, tablet and desktop composition contracts

Edition 0.9 · Proposed composition rules, not an instruction to shrink desktop layouts onto a phone.

## Shared principles

Keep the same facts, identity and task state across sizes; change arrangement, navigation and interaction density. Fit content rather than device labels. Start validation at 320, 390, 768, 1024 and 1440 CSS pixels, plus zoom/text enlargement, landscape and split-screen. These are review samples, not immutable breakpoints. A content collision should trigger reflow before a media-query label says it is a “tablet”. Touch and keyboard can coexist on any width.

Use one principal reading flow and one primary action per step. Desktop width does not justify stretching short forms or adding empty side panels. Bounded line lengths, aligned metadata and open whitespace provide hierarchy. Mobile preserves customer task access and useful previews; it does not hide essential policies or fees under tiny links. Frameless means fewer nested containers, not unclear control boundaries.

| Surface | Narrow/mobile | Medium/tablet | Wide/desktop |
| --- | --- | --- | --- |
| Explore list | Search/area, filter row, single column of merchant windows, bottom navigation | One or two columns when each stays readable | Stable top navigation and constrained 2–3 column results; filters near query |
| Explore map | Map takes main area; compact search, result count, one collapsed selection sheet above nav | Map with expandable selection region; avoid competing side drawers | Results rail and map side by side; selected preview belongs to the rail |
| Merchant space | Compact identity, composed widgets, sideways product shelf | Preserve curated mini-space width or deliberate secondary widget arrangement | Centred mini-space or owner-chosen tested composition; no automatic full-width corporate website |
| Item detail | Rounded sheet; expand to focused view for long task | Bounded modal/focused route | Comfortable modal; related information only when useful |
| Booking | One step at a time; sticky action clears keyboard/safe area | Dates and times can share space | Service summary beside date/time; customer details/review remain a clear sequence |
| Bag/checkout | Editable lines then fulfilment/contact/review | Summary can be an adjacent column | Bounded form plus persistent concise summary; no duplicated competing totals |
| Activity | Attention section then chronological/filterable records | List plus selected record when space allows | List/detail workspace; record status and action clearly grouped |
| Conversation | Thread route; composer remains accessible over keyboard | Thread plus contextual record disclosure | Thread and compact linked-record context, without a third redundant identity panel |
| Account/settings | Section list → focused settings route | Two-level navigation | Left settings navigation and readable panel |
| Studio Today | Action queue first, relevant workload next | Queue plus next work context | Work queue and useful schedule/preparation view; optional metrics secondary |
| Studio editor | Preview/Edit modes with task sheet and stable Back | Preview and a single scoped inspector | Navigation/library, canvas, inspector only when useful; hide redundant panels |
| Studio calendar | Day/agenda default; accessible date switch | Day/week choice with usable lanes | Week/resource lanes, linked detail inspector, agenda alternative |
| Console case | Prioritised case summary then action/history | Queue plus selected case | Queue, case detail and optional permitted context; avoid four competing columns |

## Navigation, scrolling and overlays

Customer bottom navigation is for Explore, Saved, Activity and Account. Desktop adapts to a stable top/side pattern only after visual testing; no duplicate top and bottom destination bars. During a focused transaction use task Back/Close rather than global navigation inside the task. Native/web back restores origin, not a generic home. Desktop hover details must have tap/focus alternatives.

Use one principal page scroll; additional scrolling is intentional for shelves, calendars, map gestures and long dialogs. Avoid a scrollable card inside a scrollable panel inside the page. Sticky controls must not cover input, notices, map attribution, native gestures or browser zoom. A popup can expand to a page when keyboard/text size leaves too little usable height. The overlay's action region follows actual visual viewport changes rather than an assumed fixed phone height.

Product shelves retain their place, selected variant and keyboard controls after detail closes. They must show continuation through a peek, count or controls without depending on precision gestures. A dense catalogue can open a focused browse/filter view; it never becomes an infinitely tall widget. Calendar/table views need agenda/stacked alternatives; do not squeeze an operational table into unreadable columns.

## Content extremes

Review no image, wordmark only, very long business name, long price/currency, many variants, no reviews, thousands of offers, sold-out service, overlapping staff/resource lanes, long policy text and mixed language. Important labels wrap; secondary content can truncate only with an accessible full value. Reserve shape/aspect ratio for images to prevent jumps. Right-to-left and translated layouts are explicit design reviews. Do not equate a narrow screenshot with mobile quality: keyboard, gestures, focus, slow networks and return state are part of composition.
