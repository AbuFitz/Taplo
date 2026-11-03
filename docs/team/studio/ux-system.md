# Studio UX system (all owner pages)
Author: ux-designer. Inputs: contract.md, slice/ux-spec.md (home, settled), critic-round3, qa-round1, DashboardShell.tsx, dashboard/*.tsx, audit screenshots (390 and 1440). Labels: [O] observed in code/screens, [I] inference. AI/engineering review only; no user research, metrics or participants claimed.
Contract untouched: Looks/Colours, editor tabs (Content, Profile, Design, Settings), agreed page titles (Treatments, Team, Products, Google reviews, Analytics, Settings, Bookings), draft vs publish, labelled samples, provisional plans, monochrome UI, no invented numbers.
One amendment to flag for the owner/coordinator: the home dock's fourth item "Share" moves into the More sheet (section 1); home keeps its Share row. Everything else on home is unchanged.

## 0. What is wrong now [O]
- Hamburger on every manage page; the floating dock exists only on home (Studio.tsx l.115-203). Plan pages cannot be reached in one tap.
- Shell header repeats the business name, then a section label that the h1 repeats ("Services" over "Treatments"), plus a tiny plan link ("Business Plan", DashboardShell l.149). Home shows the word "Dashboard" under the name.
- Rows are a pile of buttons: Services = up, down, Edit, Archive per row; Products = Edit, Archive; Team = pencil, bin, "Working hours".
- Bookings stacks segmented tabs, a second segmented view switch, a staff select, "Block time" and "Add sample bookings" above an empty list.
- Reviews, Analytics, Products and Settings open on illustration cards that outweigh the task. Settings leads with a plan simulator and a 11-line feature list.
- Loading is a text line for every page except home (DashboardShell l.172-178).

## 1. Navigation model
Primary destinations (always reachable in one tap): Home, My page, Services, Bookings. Secondary (More): Reviews, Team, Products, Analytics, Settings, plus Share when published.
- Mobile (<1024): the home floating dock becomes the single navigation on every manage page, 5 items with visible labels: Home, Page, Services, Bookings, More. The hamburger is removed on manage pages. More opens a bottom sheet (section 4) listing the secondary items as rows (icon, label, one-line state) in this order: Reviews, Team, Products, Analytics, Settings. Share (published only) is the first row.
- Labels: use the terminology function already in NAV (`terms.services`, "Vehicle stock"). Dock labels are short: Home, Page, {Services term}, Bookings, More. Visible text, not aria-only. "Dashboard" is renamed "Home" (route unchanged).
- Dock badge: only Bookings, only when attention count > 0 (pending + new enquiries). No other badge.
- Active destination: `aria-current="page"`, filled icon; More shows active when a secondary page is open.
- Plan-gated or empty sections: shown as ordinary rows, no lock icons, no price, no "upgrade". If `ent` does not include a feature (Analytics, Team pages), its More row shows the plain words "Not on your plan"; its page shows one sentence and one text link "Compare plans" (provisional, links `/pricing`). Empty-but-entitled sections show their empty state (section 2), never a pitch. A gated page never appears in the dock.
- Desktop (>=1024): left rail, same destinations and order: Home, My page, Services, Products, Team, Bookings, Reviews, Analytics, Settings (Settings pinned at bottom). Group labels are not added. The rail replaces the dock; there is no hamburger. Rail width fixed 220px.
- My page (editor): keeps its own header and bottom tabs [locked]. Only the outer chrome aligns: its menu button opens the same More-style navigation sheet but listing all 8 destinations; the dock is not shown there (it would collide with the tabs). Desktop: the same rail collapses to icons.
- Back/refresh: every destination is a real route; refresh returns to the same page with the same list scroll at top; sheets are not route-persisted, edits in an open sheet are lost on refresh and the sheet says so only when dirty (section 4).

## 2. Page template (every manage page)
Order top to bottom, one column at 390, max 720px content column on desktop with the rail at left:
1. Shell header (section 5).
2. Title: h1 (agreed title). Directly under it ONE status line (14px, text, not a card), computed from data: e.g. "6 services, all visible", "3 people", "Google link added", "Draft", "No numbers yet". Counts live here, never in tiles. Hidden when it would be "0 items".
3. One primary action, filled black, right-aligned on desktop and full-width under the status on mobile: Add service, Add team member, Add item. Pages with no create action (Reviews, Analytics, Settings) have none.
4. Attention rows (only if count > 0): same component as home attention rows; at most 2, "and {n} more" link.
5. List, or the page's single form.
6. Optional footnote line (truthful scope sentence), never a card with an illustration.
- List row: one tappable row, min height 64px, whole row opens its edit sheet. Content: title, one meta line (price/time/role/status), trailing chevron. Row state (Archived, Hidden, Unavailable) is a text word in the meta line. No Edit, Archive, up, down or bin buttons on the row.
- Row actions: Archive/Delete/Hours live inside the edit sheet (destructive at bottom, text button, confirm inline). Reordering: header "More" menu has "Reorder", which turns rows into drag-handle rows with keyboard Move up / Move down; only on lists > 1 row.
- Search/filter: not shown for <= 8 rows; above 8 a single search field appears under the status line (Team's search already exists, hide it at 3 people). One filter at most, as a segmented control, never both.
- Empty: one sentence of what goes here + the primary action (the same button as in the header, not a second one). No illustration, no counters. Samples are offered only as a text link "Add labelled examples" where the product already supports them.
- Loading: shell header + page title + status line skeleton + 3 skeleton rows at final row height (zero layout shift). Applies to every route, replacing "Loading your workspace…". Fix: DashboardShell must render a per-route skeleton like StudioSkeleton, since it withholds children until `ready` [O, qa-round1 #17].
- Error (load/save): inline `role=alert` banner above the list: what failed, "Try again" button, data kept. Never a raw error, never a toast only.
- Long content: titles wrap to 2 lines then ellipsis (full text in `title` and in the sheet); meta line wraps; no horizontal scroll at 390; 200-char strings do not hide the chevron.
- Scroll: the page scrolls, header is sticky, the dock floats with scroll padding = dock height + safe-area inset so the last row and primary button are never covered. Fix the animated-ancestor bug that moves fixed elements (qa-round1 defect A) before relying on this.

## 3. Per page
- Services (Treatments): leads with the list and Add service; status "n services". Offers move below the list as a collapsed "Offers" row that opens its form in a sheet; hidden entirely until Services exist. Removed: row buttons; "No offers yet" block shown open.
- Bookings: leads with attention (needs a reply), then Agenda. One segmented control: Calendar, Enquiries, Hours and rules. Inside Calendar, ONE view switch (Agenda default; Day, Week, Month in a single compact control); the staff select appears only when >1 bookable staff; Block time and "Add sample bookings" move to the header More menu (samples labelled "sample"). Empty: "No upcoming bookings. When customers book or request a time it appears here." plus nothing else. Hides until data: staff select, view switch beyond Agenda on first use is allowed but Block time is menu-only.
- Reviews (Google reviews): leads with the Google link field and status "Google link added" / "No Google link yet". The "Let your customers do the talking" hero is deleted. Keep the truthful note that ratings and reviews are not imported or typed in. Primary action: Save link, sticky under the field when keyboard open. No review list until a real source exists.
- Team: status "n people"; rows show avatar, name, role, bookable state; edit sheet holds bio, services, working hours, delete. Hidden until there is a member: search. Plan-limit notice (`maxStaffBookable`) shows as one status-line suffix, no paragraph. Not entitled: sentence + Compare plans link.
- Products (Vehicle stock for car dealers): list with Add item; meta line "£18, Enquire" etc. The "Checkout and NFC not built yet" card becomes one footnote line under the list, absent when empty (the empty sentence already says products open an enquiry or link). No illustration.
- Analytics: not entitled: one sentence "Analytics is not on your plan." + Compare plans link. Entitled, no tracking: "No numbers yet. Tracking is not switched on." One text link "Share your page" to Home. No chart art, no placeholder figures or zero tiles, until tracking exists.
- Settings: sections as plain list groups: Plan (demo simulator, with "provisional" kept beside prices; the 11-line entitlement list moves behind "What does each plan include?"), Not connected (billing, email, domains, export: one collapsed row with the existing sentence), Demo data (Reset opens a confirm dialog, section 4). Header plan link is removed (section 5); this is the only place the plan shows.
- My page: outer chrome only. Menu button opens full navigation sheet; Publish/View keep their meaning and match home copy ("Published in this browser").

## 4. One sheet/dialog pattern
- Mobile: bottom sheet, max height 92dvh (visual viewport when keyboard open), grabber, header (title left, Close X 44px right), scrolling body, sticky footer with the one primary (Save) and a text Cancel. Desktop: right panel 480px, same header/body/footer; full-height, no modal over modal.
- Confirmations (Archive, Delete, Reset) are small centred dialogs, two buttons, destructive named ("Archive Skin fade"), default focus on Cancel.
- Keyboard open on mobile: sheet resizes to the visual viewport, focused field scrolled into view, sticky footer stays above the keys, dock hidden (`studio-kb`).
- Dirty close (X, Esc, backdrop): inline "Discard changes?" row in the footer with Keep editing / Discard. Clean close is immediate.
- Failed save: stays open, inline alert above footer "Could not save. Your changes are still here." plus Retry. Validation: field-level message linked with `aria-describedby`; first invalid field focused; footer button remains enabled.
- Focus: trap inside, Esc closes, focus returns to the opener row/button (qa-round1 #12c: the opener must be retained; pass `onCloseAutoFocus` or a trigger ref). Open/close announced via dialog title; save success announces "Saved" in a polite region.

## 5. Shared shell header
- Left: business name (link to Home, ellipsis after 2 lines, full name in `title`); no menu button on mobile manage pages, no section label under it.
- Next to it, only on pages other than Home: a small pill "Draft" or "Published" (same component as home). Hidden on Home (the status strip owns it).
- Right: "View page" (one place; unchanged label and target `/demo/preview`). When no business name exists, the Taplo logo link.
- Removed: plan link ("Business Plan"), "Dashboard" sub-label, section label. Desktop header carries the same three items, aligned to the content column.
- Top edge: header background equals page background, no white flash at overscroll; sticky.

## 6. States
| State | Behaviour |
| --- | --- |
| First use | Home leads. Other pages show title, empty sentence, the one primary action. No counters, no plan text, More shows only entitled rows plainly. |
| Populated | Title, status line, optional attention rows, list. Search only above 8 rows. |
| Empty | Sentence + same primary action. No illustration. |
| Error | Inline banner with Try again; the rest of the page stays usable. |
| Height 600px | Header + title + status + primary action visible without scrolling; sheets use 92dvh and body scrolls; dock does not overlap the last row (scroll padding). |
| Keyboard open | Dock hidden, sheet footer above keys, focused field visible, header stays sticky. |
| Reduced motion | No entrance animation required to reveal content; dock position identical. |

## 7. Delete / merge
- Hamburger on manage pages (dock + More replaces it); duplicate section label in header; plan link; "Dashboard" label.
- Per-row Edit, Archive, up, down, pencil, bin and "Working hours" buttons; row-level duplicates of the sheet's actions.
- Illustration cards on empty pages (Reviews hero, Analytics art, Products and Settings "not built / not connected" art cards); "Let your customers do the talking".
- Bookings: Add sample bookings as a page button, always-visible staff select, nested second segmented control, Block time button.
- Settings: 11-line plan entitlement list open by default; second "Not connected" card as a full card.
- Team search when <= 8 people; Offers form open under Services.
- Separate decision "Share" dock slot (now row in More and on Home).

## 8. Acceptance criteria (browser-checkable)
1. At 390 on Services, Bookings, Reviews, Team, Products, Analytics and Settings the same dock (Home, Page, Services, Bookings, More) is visible with text labels, and no hamburger exists.
2. From any manage page, each of the 8 destinations is reached in at most 2 taps; Reviews, Team, Products, Analytics, Settings in exactly 2 (More, row).
3. At 1440 the rail lists the 9 destinations in the section 1 order; the dock is absent.
4. No manage page header contains "Plan", "Dashboard" or a section label; it contains the name, (non-home) status pill and "View page" once.
5. Each page has one h1, at most one filled primary button (not counting sheets), and no tile showing "0".
6. A list row of Services, Products or Team contains no button other than the row itself; Archive/Delete are only reachable in the edit sheet; Reorder keyboard actions (Move up/down) work with arrow keys and are announced.
7. Search is absent with 8 rows and present with 9.
8. Empty Services, Products, Team show a sentence and exactly one add button; Reviews shows the link field; Analytics shows no chart image.
9. A not-entitled Analytics or Team page shows one sentence and one Compare plans link and no lock icon, price or feature list; More shows "Not on your plan".
10. Bookings with one staff has no staff select; Add sample bookings and Block time are inside the header menu.
11. Sheet: at 390x844 it is at most 92% tall; at visual viewport 390x340 the focused input and Save are inside the viewport and the dock is hidden; Esc and Close return focus to the opening row; dirty close shows "Discard changes?"; Save failure keeps entered values and shows Retry.
12. At 390x600 title, status line and primary action are visible without scrolling and the dock never covers the last row's text or any button after scrolling to the end.
13. Loading any manage route shows header + skeleton with the same heights as loaded content (layout shift under 0.02 in the layout-shift API); no "Loading your workspace…" text.
14. A 90-character item title and 200-character note cause no horizontal scroll at 390 and the row chevron stays visible.
15. All dock, rail, row and sheet controls are at least 44px, have visible focus rings including filled black buttons, and tab order is header, title area, primary action, attention, list, dock.
16. Copy never says live, public, or ready to share; all plan prices carry "provisional"; no metric appears on Analytics.
17. My page: Looks/Colours control and bottom tabs render unchanged; its menu opens the 8-destination sheet.

## 9. Open items for the main session
- Confirm the Share amendment (section 1) or keep a 5th dock slot.
- Confirm the "Home" rename of "Dashboard"; route and `data-testid` unchanged.
- Entitlement keys for Team and Products gating must come from `resolveEntitlements`; only Analytics is gated in code today (Placeholders.tsx l.11), so Team and Products show the sentence only if their entitlement exists.
