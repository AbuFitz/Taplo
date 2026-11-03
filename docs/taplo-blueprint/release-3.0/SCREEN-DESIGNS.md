# Screen designs and interaction contracts

67 populated reference compositions, responsive/state recipes and exact task-family bindings. Reference rendering is not native/provider integration proof.

## onboarding.identity · Let’s start with your business.

A name and what you do. The rest can come together as you go.

Composition: form. Record: Business. Task: UpsertOnboardingDraft.

**Fields:** Business name (text); What do you do? (text).

**Visible facts:** .

**Actions:** Continue, Skip for now.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpsertOnboardingDraft; navigation/preflight never commits an action by itself.

## onboarding.category · What best describes your work?

Choose a starting point. You can combine different kinds of work.

Composition: choices. Record: Business. Task: UpsertOnboardingDraft.

**Fields:** Search business types (search).

**Visible facts:** Barber & hair — Appointments, professionals and products; Mobile services — Jobs, coverage and quotes; Something else — Choose the tools you need.

**Actions:** Use this starting point, Choose capabilities.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpsertOnboardingDraft; navigation/preflight never commits an action by itself.

## onboarding.look · Choose a look.

Your content stays with you when you change the design.

Composition: choices. Record: Business. Task: UpsertOnboardingDraft.

**Fields:** Read-only facts/selection.

**Visible facts:** Type first — Bold name, clear actions; Gallery first — Let your own photos introduce you; Cover first — One image, then what you offer.

**Actions:** Continue, Back.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpsertOnboardingDraft; navigation/preflight never commits an action by itself.

## onboarding.content · Make it sound like you.

Your words and your work. Photos can come later.

Composition: form. Record: Business. Task: UpsertOnboardingDraft.

**Fields:** Introduction (text); Website (url).

**Visible facts:** .

**Actions:** Preview your page, Skip for now.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpsertOnboardingDraft; navigation/preflight never commits an action by itself.

## onboarding.review · Your page is taking shape.

Review your draft. You choose when it goes live.

Composition: mini. Record: Business. Task: PreviewPublish.

**Fields:** Read-only facts/selection.

**Visible facts:** Chapter Barbers — Appointments and styling products; Services — Add your price and duration; Contact — Add the details customers should see.

**Actions:** Create your account, Back to editing.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family PreviewPublish; navigation/preflight never commits an action by itself.

## onboarding.account · Keep what you’ve made.

Create your account to continue in Studio.

Composition: auth. Record: User. Task: BeginSignIn.

**Fields:** Email (email).

**Visible facts:** Continue with Apple — ; Continue with Google — .

**Actions:** Continue with email, Back.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family BeginSignIn; navigation/preflight never commits an action by itself.

## onboarding.resume · Pick up where you left off.

Your draft is ready to continue.

Composition: list. Record: Business. Task: UpsertOnboardingDraft.

**Fields:** Read-only facts/selection.

**Visible facts:** Chapter Barbers — Last edited today; Look and introduction — Saved in your draft; First offer — Ready to set up.

**Actions:** Continue draft, Start another business.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpsertOnboardingDraft; navigation/preflight never commits an action by itself.

## onboarding.studio_entry · Your next useful step.

Make one offer ready for a real customer.

Composition: today. Record: CapabilityReadiness. Task: EvaluateReadiness.

**Fields:** Read-only facts/selection.

**Visible facts:** Add your first service — Name, price and duration; Set working time — For the professional customers can book; Review and publish — See what customers will get.

**Actions:** Add a service, View your page.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family EvaluateReadiness; navigation/preflight never commits an action by itself.

## studio.today · Today, in one place.

Tuesday 3 November · Chapter Barbers

Composition: today. Record: Booking. Task: ListWork.

**Fields:** Read-only facts/selection.

**Visible facts:** 14:00 — Skin fade · Sam · confirmed; 15:00 — Haircut · Riley · confirmed; Collection — Styling clay · ready to collect.

**Actions:** Open calendar, Add work.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ListWork; navigation/preflight never commits an action by itself.

## studio.offer_list · What you offer.

Services, products and sessions share one home.

Composition: list. Record: Offer. Task: UpdateOfferDraft.

**Fields:** Find an offer (search).

**Visible facts:** Skin fade — Service · £25 · live; Styling clay — Product · £14 · 12 available; First cut consultation — Service · draft.

**Actions:** Add offer, Review drafts.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpdateOfferDraft; navigation/preflight never commits an action by itself.

## studio.service_editor · Set up your service.

Start with the facts customers need.

Composition: form. Record: Offer. Task: UpdateOfferDraft.

**Fields:** Service name (text); Price (£) (number); Duration (minutes) (number).

**Visible facts:** Bookable with — Sam · main location; Working time — Add or edit here; Payment — No upfront payment.

**Actions:** Save draft, Review service.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpdateOfferDraft; navigation/preflight never commits an action by itself.

## studio.hours_quick · Sam’s working hours.

Main location · Europe/London · starts 4 November

Composition: hours. Record: AvailabilityRule. Task: PreviewWorkingHoursImpact.

**Fields:** Read-only facts/selection.

**Visible facts:** Monday — 09:00–17:00; Tuesday — 09:00–17:00; Wednesday — 09:00–17:00; Thursday — 09:00–17:00; Friday — 09:00–17:00; Saturday — Closed; Sunday — Closed.

**Actions:** Review impact, More availability settings.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family PreviewWorkingHoursImpact; navigation/preflight never commits an action by itself.

## studio.availability_full · Availability that fits the work.

Working time, exceptions and busy calendars stay distinct.

Composition: calendar. Record: AvailabilityRule. Task: ApplyWorkingHours.

**Fields:** Read-only facts/selection.

**Visible facts:** Weekly pattern — Monday–Friday · 09:00–17:00; Lunch break — 12:30–13:00; Time off — Friday 20 November; Calendar connection — Last checked 2 minutes ago.

**Actions:** Edit weekly pattern, Add exception.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ApplyWorkingHours; navigation/preflight never commits an action by itself.

## studio.product_editor · Add a product.

Keep the item, its options and fulfilment clear.

Composition: form. Record: Variant. Task: UpdateProductDraft.

**Fields:** Product name (text); Price (£) (number); Opening stock (number).

**Visible facts:** Stock mode — Tracked; Fulfilment — Collection · main location.

**Actions:** Save draft, Review product.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpdateProductDraft; navigation/preflight never commits an action by itself.

## studio.inventory · Know what’s available.

Reserved, sold and unavailable stock are shown separately.

Composition: table. Record: InventoryBalance. Task: AdjustInventory.

**Fields:** Read-only facts/selection.

**Visible facts:** Styling clay — 12 sellable — 2 reserved; Texture spray — 8 sellable — 1 committed; Return awaiting inspection — 1 unavailable — No restock yet.

**Actions:** Record adjustment, View stock history.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family AdjustInventory; navigation/preflight never commits an action by itself.

## studio.session_editor · Set up a session.

A real date, the right host and the right number of places.

Composition: form. Record: Session. Task: UpsertSessionDraft.

**Fields:** Session name (text); Date (date); Start time (time); Capacity (number); Price (£) (number).

**Visible facts:** Host — Alex; Room — Studio one; Timezone — Europe/London.

**Actions:** Save session draft, Review session.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpsertSessionDraft; navigation/preflight never commits an action by itself.

## studio.quote · Agree the work before it starts.

Quote Q-014 · current revision 2

Composition: form. Record: Quote. Task: CreateQuoteDraft.

**Fields:** Scope (text); Quote total (£) (number).

**Visible facts:** Customer decision — Awaiting acceptance; Scheduling — No date reserved yet; Deposit — Shown before acceptance.

**Actions:** Review quote, Save draft.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CreateQuoteDraft; navigation/preflight never commits an action by itself.

## studio.calendar · A clear view of your time.

Agenda · main location · all permitted professionals

Composition: calendar. Record: Booking. Task: ListWork.

**Fields:** Read-only facts/selection.

**Visible facts:** 09:00 — Haircut · Riley · 30 minutes; 10:00 — Skin fade · Sam · 40 minutes; 12:30 — Lunch · unavailable; 14:00 — Skin fade · Sam · 40 minutes.

**Actions:** Add booking, Change view.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ListWork; navigation/preflight never commits an action by itself.

## studio.work_detail · Skin fade with Sam.

Booking B-014 · confirmed

Composition: detail. Record: Booking. Task: AssessCancellation.

**Fields:** Read-only facts/selection.

**Visible facts:** Customer — Jordan · verified relationship; When — 12 November · 14:00 · 40 minutes; Payment — £10 paid · £15 due; Policy — Accepted version attached.

**Actions:** Manage appointment, View payment.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family AssessCancellation; navigation/preflight never commits an action by itself.

## studio.fulfilment · Prepare the right order.

Order O-021 · collection

Composition: table. Record: Fulfilment. Task: UpdateFulfilment.

**Fields:** Read-only facts/selection.

**Visible facts:** Styling clay — 2 ordered — 1 prepared; Collection — Main location — After 16:00; Payment — £28 received — Receipt attached.

**Actions:** Mark ready, Open order history.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family UpdateFulfilment; navigation/preflight never commits an action by itself.

## studio.payment_setup · Get ready to take payments.

Your business connects directly with Stripe.

Composition: detail. Record: PaymentAuthority. Task: StartMerchantOnboarding.

**Fields:** Read-only facts/selection.

**Visible facts:** Identity verification — Action required; Accept payments — Not ready; Receive payouts — Not ready.

**Actions:** Continue secure setup, View requirements.

**States:** normal, loading, empty, offline, denied, success, unknown.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family StartMerchantOnboarding; navigation/preflight never commits an action by itself.

## studio.refund · Review the refund.

Keep the payment, refund and stock decisions separate.

Composition: policy. Record: Refund. Task: RequestRefund.

**Fields:** Refund amount (£) (number); Reason (text).

**Visible facts:** Captured — £25.00; Already refunded — £0.00; Available to refund — £25.00.

**Actions:** Review refund, Back.

**States:** normal, loading, empty, offline, validation, conflict, denied, success, unknown.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family RequestRefund; navigation/preflight never commits an action by itself.

## studio.team_invite · Give them the access they need.

A calendar resource, login and public profile are separate choices.

Composition: form. Record: TeamInvitation. Task: InviteMember.

**Fields:** Name (text); Invitation email (email).

**Visible facts:** Work scope — Own assigned appointments; Location — Main location; Profile — Draft bio and gallery only.

**Actions:** Review invitation, Save draft.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family InviteMember; navigation/preflight never commits an action by itself.

## studio.team_work · Your work.

Sam · Chapter Barbers · main location

Composition: calendar. Record: Membership. Task: ListWork.

**Fields:** Read-only facts/selection.

**Visible facts:** 14:00 — Skin fade · Jordan; 15:00 — Haircut · Morgan; Profile — Your draft edits await publication.

**Actions:** Open appointment, Edit my profile.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ListWork; navigation/preflight never commits an action by itself.

## studio.role_editor · Make access understandable.

Choose actions and scope, then review what this person can see.

Composition: roles. Record: PermissionGrant. Task: InviteMember.

**Fields:** Read-only facts/selection.

**Visible facts:** Appointments — Own assigned work; Customer information — Necessary details only; Refunds — Cannot approve; Exports — Not permitted.

**Actions:** Save access, Preview their navigation.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family InviteMember; navigation/preflight never commits an action by itself.

## studio.page_editor · Your business, your arrangement.

Content is edited once and used wherever it appears.

Composition: editor. Record: Business. Task: SetPageAppearance.

**Fields:** Read-only facts/selection.

**Visible facts:** Look — Type first; Brand — Cobalt · strong contrast; Content — Services, products, gallery; Order — Services → products → contact.

**Actions:** Preview page, Review changes.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family SetPageAppearance; navigation/preflight never commits an action by itself.

## studio.media_picker · Choose the right image.

Your work and stock decoration stay clearly separate.

Composition: gallery. Record: ImportCandidate. Task: AttachMediaAsset.

**Fields:** Read-only facts/selection.

**Visible facts:** Your uploads — 3 authorised images; Stock decoration — Search approved source; Image treatment — Contain logo · preserve transparency.

**Actions:** Use selected image, Upload image.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family AttachMediaAsset; navigation/preflight never commits an action by itself.

## studio.reward_setup · Give customers a reason to return.

Choose a clear promise your business can fulfil.

Composition: form. Record: RewardProgramme. Task: CreateRewardProgramme.

**Fields:** Earn rule (text); Reward (text); Stamps needed (number).

**Visible facts:** Refund handling — Qualifying earn reversed once; Expiry — None; Customer review — Rules shown before joining.

**Actions:** Review programme, Save draft.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CreateRewardProgramme; navigation/preflight never commits an action by itself.

## studio.scanner · Scan their pass.

Use the QR code shown in the customer’s Wallet.

Composition: scanner. Record: RewardProgramme. Task: ResolveRewardCode.

**Fields:** Read-only facts/selection.

**Visible facts:** After scanning — Check the programme and customer; Before confirming — Select eligible work or reward; Connection — Required to earn or redeem.

**Actions:** Enable camera, Enter code instead.

**States:** normal, loading, empty, offline, denied, success, unknown.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ResolveRewardCode; navigation/preflight never commits an action by itself.

## studio.sharing_wallet · One link, ready to share.

Public business cards and customer loyalty passes do different jobs.

Composition: share. Record: WalletPass. Task: IssueWalletPass.

**Fields:** Read-only facts/selection.

**Visible facts:** Business card — Scan to view Chapter; Team card — Scan to book with Sam; Customer loyalty — Private reward programme.

**Actions:** Preview business card, Copy public link.

**States:** normal, loading, empty, offline, denied, success, unknown.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family IssueWalletPass; navigation/preflight never commits an action by itself.

## studio.communications · Say the right thing, at the right time.

Operational updates and marketing have separate rules.

Composition: form. Record: Campaign. Task: PreviewCampaign.

**Fields:** Campaign name (text); Message (text).

**Visible facts:** Eligible audience — 83 recipients; Excluded — 12 opted out or unavailable; Allowance — 83 of 250 sends.

**Actions:** Preview and review, Save draft.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family PreviewCampaign; navigation/preflight never commits an action by itself.

## studio.domain · Use an address you own.

Connect your domain without disrupting business email.

Composition: form. Record: Domain. Task: ConnectDomain.

**Fields:** Domain (text).

**Visible facts:** Ownership — Verification required; DNS — Use the exact supplied record; Email records — Keep existing MX records.

**Actions:** Check connection, View setup steps.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ConnectDomain; navigation/preflight never commits an action by itself.

## studio.billing · A plan that fits your work.

No charge per team member. Optional purchases stay deliberate.

Composition: plans. Record: BusinessSubscription. Task: ChangePlan.

**Fields:** Read-only facts/selection.

**Visible facts:** Free — £0 — 5 offers · 30 new bookings/orders; Core — £12/month — Everyday operations; Pro — £24/month — Rewards and repeat work; Business — £49/month — Up to three locations.

**Actions:** Review plan change, View invoices.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ChangePlan; navigation/preflight never commits an action by itself.

## studio.help · Get back to the task.

Start with the relevant fix. A human route stays available.

Composition: detail. Record: SupportCase. Task: OpenSupportCase.

**Fields:** Read-only facts/selection.

**Visible facts:** Why are no times showing? — Check working time, resources and busy calendars; Payment still processing? — Check the original operation; Need more help? — Include safe task diagnostics.

**Actions:** Open a support case, Return to task.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family OpenSupportCase; navigation/preflight never commits an action by itself.

## studio.settings · Settings, without the hunt.

Business details, security and preferences in their proper places.

Composition: list. Record: User. Task: SetAppearancePreference.

**Fields:** Read-only facts/selection.

**Visible facts:** Appearance — System · light and dark supported; Security — Sign-in and strong verification; Business — Locations, team and ownership; Privacy — Exports and account closure.

**Actions:** Open security, Manage business.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family SetAppearancePreference; navigation/preflight never commits an action by itself.

## customer.explore_list · Find your next good place.

Choose an area. Discover businesses in their own style.

Composition: explore. Record: Business. Task: QueryExplore.

**Fields:** What are you looking for? (search); Area (search).

**Visible facts:** Chapter Barbers — Appointments · local premises; Moss Studio — Pottery workshops · collection; Field & Form — Mobile detailing · comes to you.

**Actions:** Map, Filters.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family QueryExplore; navigation/preflight never commits an action by itself.

## customer.explore_map · Around your chosen area.

The same businesses, with location context.

Composition: map. Record: Location. Task: QueryExplore.

**Fields:** Read-only facts/selection.

**Visible facts:** Chapter Barbers — Public premises; Moss Studio — Workshop venue; Field & Form — Service coverage area.

**Actions:** List, Search this area.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family QueryExplore; navigation/preflight never commits an action by itself.

## customer.location_search · Where should we look?

Location permission is optional.

Composition: form. Record: Location. Task: QueryExplore.

**Fields:** Town or postcode (search).

**Visible facts:** Use my location — Only when you choose; Manual area — Browse without GPS.

**Actions:** Use this area, Use my location.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family QueryExplore; navigation/preflight never commits an action by itself.

## customer.mini_space · Chapter Barbers

Good cuts. A familiar face. Time that works for you.

Composition: mini. Record: Offer. Task: CreateReservation.

**Fields:** Read-only facts/selection.

**Visible facts:** Skin fade — £25 · 40 min; Haircut — £20 · 30 min; Styling clay — £14 · collection.

**Actions:** Book an appointment, Save business.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CreateReservation; navigation/preflight never commits an action by itself.

## customer.product_sheet · Styling clay.

Chapter Barbers · collection available

Composition: sheet. Record: Variant. Task: CreateOrder.

**Fields:** Quantity (number).

**Visible facts:** Price — £14.00; Collection — Main location; More from Chapter — Texture spray · £12.

**Actions:** Add to bag, Close.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CreateOrder; navigation/preflight never commits an action by itself.

## customer.service_sheet · Skin fade.

Choose the professional and time that work for you.

Composition: sheet. Record: Offer. Task: CreateReservation.

**Fields:** Read-only facts/selection.

**Visible facts:** Price — £25; Duration — 40 minutes; Professional — Sam or any eligible professional.

**Actions:** Choose a time, Close.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CreateReservation; navigation/preflight never commits an action by itself.

## customer.time_select · Choose your time.

Skin fade · Sam · Europe/London

Composition: slots. Record: Reservation. Task: CreateReservation.

**Fields:** Read-only facts/selection.

**Visible facts:** Thursday 12 November — 14:00 — 14:45 — 16:00; Friday 13 November — 09:00 — 11:30 — 15:00.

**Actions:** Continue, Change professional.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CreateReservation; navigation/preflight never commits an action by itself.

## customer.class_select · A place at the table.

Introduction to pottery · Moss Studio

Composition: form. Record: Session. Task: CreateReservation.

**Fields:** Places (number).

**Visible facts:** Saturday 14 November — 10:00–12:00; Places available — 4; Price — £35 per person.

**Actions:** Review booking, Join waitlist.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CreateReservation; navigation/preflight never commits an action by itself.

## customer.quote_request · Tell them what you need.

Field & Form will review the scope before agreeing the work.

Composition: form. Record: Quote. Task: SendMessage.

**Fields:** What needs doing? (text); Service postcode (text).

**Visible facts:** Next step — The business replies with scope and price; Status — An enquiry does not reserve a date.

**Actions:** Send enquiry, Back.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family SendMessage; navigation/preflight never commits an action by itself.

## customer.bag · Your bag.

Everything here is sold by Chapter Barbers.

Composition: table. Record: Cart. Task: CreateOrder.

**Fields:** Read-only facts/selection.

**Visible facts:** Styling clay — 1 × £14 — £14.00; Collection — Main location — £0.00; Total —   — £14.00.

**Actions:** Review order, Keep browsing.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CreateOrder; navigation/preflight never commits an action by itself.

## customer.commit_review · Check your appointment.

Skin fade with Sam · Thursday 12 November · 14:00

Composition: policy. Record: AgreementSnapshot. Task: CommitBooking.

**Fields:** Read-only facts/selection.

**Visible facts:** Appointment total — £25.00; Deposit today — £10.00; Pay at appointment — £15.00; Cancellation — Read Chapter’s accepted policy.

**Actions:** Continue to payment, View policy.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CommitBooking; navigation/preflight never commits an action by itself.

## customer.payment · Complete your payment.

Chapter Barbers · £10 deposit

Composition: payment. Record: Payment. Task: StartPayment.

**Fields:** Read-only facts/selection.

**Visible facts:** Amount today — £10.00; Seller — Chapter Barbers; Payment method — Secure provider entry.

**Actions:** Continue securely, Back.

**States:** normal, loading, empty, offline, unknown.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family StartPayment; navigation/preflight never commits an action by itself.

## customer.confirmation · You’re booked.

Skin fade with Sam · 12 November · 14:00

Composition: confirmation. Record: Booking. Task: GetOperation.

**Fields:** Read-only facts/selection.

**Visible facts:** Deposit received — £10.00; Remaining balance — £15.00; Your next step — Arrive at your selected location.

**Actions:** View appointment, Save business.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family GetOperation; navigation/preflight never commits an action by itself.

## customer.private_return · Your next visit, right here.

Your private view of Chapter Barbers.

Composition: today. Record: CustomerRelationship. Task: GetOperation.

**Fields:** Read-only facts/selection.

**Visible facts:** Next appointment — 12 November · 14:00 · Sam; Order — Styling clay · ready to collect; Rewards — 7 of 8 stamps.

**Actions:** Manage appointment, View rewards.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family GetOperation; navigation/preflight never commits an action by itself.

## customer.manage_work · Manage your appointment.

See the effect before changing anything.

Composition: policy. Record: CancellationAssessment. Task: AssessCancellation.

**Fields:** Read-only facts/selection.

**Visible facts:** Current time — 12 November · 14:00; Deposit paid — £10.00; Cancellation assessment — Policy and applicable rights checked first.

**Actions:** Change time, Review cancellation.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family AssessCancellation; navigation/preflight never commits an action by itself.

## customer.rewards · One more visit.

Chapter’s reward programme · 7 of 8 stamps

Composition: rewards. Record: RewardProgramme. Task: IssueWalletPass.

**Fields:** Read-only facts/selection.

**Visible facts:** Earn — One stamp per qualifying completed haircut; Reward — Free standard haircut; Expiry — None.

**Actions:** Add to Wallet, View programme rules.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family IssueWalletPass; navigation/preflight never commits an action by itself.

## customer.saved · Your familiar places.

Keep the businesses you want to come back to.

Composition: explore. Record: CustomerRelationship. Task: SaveBusiness.

**Fields:** Read-only facts/selection.

**Visible facts:** Chapter Barbers — Next appointment · 12 November; Moss Studio — New workshop dates; Field & Form — Your mobile service.

**Actions:** Explore businesses, Open activity.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family SaveBusiness; navigation/preflight never commits an action by itself.

## customer.review_report · How was your visit?

Your honest experience helps other people choose.

Composition: form. Record: Review. Task: SubmitReview.

**Fields:** Rating (number); Your review (text).

**Visible facts:** Review basis — Eligible completed appointment; Report a concern — A separate reporting route.

**Actions:** Review and publish, Report a concern.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family SubmitReview; navigation/preflight never commits an action by itself.

## customer.share · Share Chapter.

Send the public business page. Your private activity stays private.

Composition: share. Record: PublicShare. Task: GetPublicShare.

**Fields:** Read-only facts/selection.

**Visible facts:** Public link — mytaplo.com/chapter; QR code — Public business destination; Link preview — Business identity, never your appointment.

**Actions:** Copy link, Download QR.

**States:** normal, loading, empty, offline.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family GetPublicShare; navigation/preflight never commits an action by itself.

## customer.account · Your account.

Sign-in, preferences and privacy together.

Composition: list. Record: User. Task: SetAppearancePreference.

**Fields:** Read-only facts/selection.

**Visible facts:** Sign-in — Apple, Google or email code; Appearance — System; Private activity — Your authorised relationships; Privacy — Export or deletion request.

**Actions:** Manage preferences, Get help.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family SetAppearancePreference; navigation/preflight never commits an action by itself.

## console.case_queue · Keep the next action clear.

Cases are assigned, scoped and auditable.

Composition: table. Record: SupportCase. Task: OpenSupportCase.

**Fields:** Read-only facts/selection.

**Visible facts:** PAY-014 — Refund outcome unknown — Payments support; ACC-009 — Owner access recovery — Access support; TRU-006 — Business report — Trust review.

**Actions:** Open assigned case, Filter cases.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family OpenSupportCase; navigation/preflight never commits an action by itself.

## console.case_detail · One case, one clear history.

PAY-014 · Chapter Barbers

Composition: case. Record: SupportCase. Task: ReconcileProvider.

**Fields:** Read-only facts/selection.

**Visible facts:** Customer request — Cancellation reported; Merchant action — Refund authorised; Provider result — Unknown; Next owner — Payments support.

**Actions:** Check operation, Add case note.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ReconcileProvider; navigation/preflight never commits an action by itself.

## console.financial · Check the outcome first.

A timeout is not proof the refund failed.

Composition: case. Record: ProviderOperation. Task: ReconcileProvider.

**Fields:** Read-only facts/selection.

**Visible facts:** Original payment — £25.00 captured; Refund intent — £10.00; Provider response — Interrupted; Next action — Reconcile original operation.

**Actions:** Check status, View audit trail.

**States:** normal, loading, empty, offline, denied, success, unknown.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ReconcileProvider; navigation/preflight never commits an action by itself.

## console.merchant_access · Recover access safely.

Identity, ownership and team grants are separate.

Composition: detail. Record: Membership. Task: RevokeMember.

**Fields:** Read-only facts/selection.

**Visible facts:** Claim — Lost owner device; Current memberships — Visible to authorised workforce only; Required evidence — Verified ownership recovery procedure.

**Actions:** Review evidence, Record decision.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family RevokeMember; navigation/preflight never commits an action by itself.

## console.moderation · Review the evidence.

A report triggers review, not automatic guilt.

Composition: case. Record: TrustReport. Task: RestrictSubject.

**Fields:** Read-only facts/selection.

**Visible facts:** Concern — Possible impersonation; Affected scope — Public business page; Evidence — Restricted case attachments; Action — Smallest justified restriction.

**Actions:** Review restriction, Request clarification.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family RestrictSubject; navigation/preflight never commits an action by itself.

## console.messages · Protect delivery without hiding work.

Campaign abuse and operational updates have different scopes.

Composition: table. Record: NotificationIntent. Task: PauseCampaign.

**Fields:** Read-only facts/selection.

**Visible facts:** Merchant campaign — Paused for review; Security messages — Separate protected stream; Recipient suppression — Must remain enforced.

**Actions:** Open campaign case, Review queue.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family PauseCampaign; navigation/preflight never commits an action by itself.

## console.integration · See the actual connection state.

Credentials, capability and projection freshness are separate.

Composition: table. Record: ProviderOperation. Task: ReconcileProvider.

**Fields:** Read-only facts/selection.

**Visible facts:** Stripe — Verification pending; Calendar — Token revoked; Wallet — Update queued; Domain — Certificate pending.

**Actions:** Reconcile selected operation, Open related case.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ReconcileProvider; navigation/preflight never commits an action by itself.

## console.incident · Contain, recover, communicate.

Incident INC-003 · synthetic exercise

Composition: case. Record: SupportCase. Task: ReconcileProvider.

**Fields:** Read-only facts/selection.

**Visible facts:** Impact — Accepted work status delayed; Containment — Affected worker paused; Recovery — Reconcile before replay; Communication — Status update owned.

**Actions:** Open recovery checklist, Record update.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ReconcileProvider; navigation/preflight never commits an action by itself.

## console.privacy · Handle the right records.

Verify scope, redact and deliver securely.

Composition: detail. Record: SupportCase. Task: ExportBusiness.

**Fields:** Read-only facts/selection.

**Visible facts:** Request — Data access; Identity — Verification required; Scope — Relevant controller/processor records; Deadline — Case-specific statutory assessment.

**Actions:** Review request, View retention holds.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family ExportBusiness; navigation/preflight never commits an action by itself.

## console.publication · Evidence before enablement.

A document existing does not make a control verified.

Composition: table. Record: LaunchEvidence. Task: CompleteEvidenceControl.

**Fields:** Read-only facts/selection.

**Visible facts:** Entity facts — Required before publication; Provider agreement — Actual scope needed; Category readiness — Scoped review; Approval evidence — Named reviewer and artefact.

**Actions:** Open evidence record, View affected capability.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CompleteEvidenceControl; navigation/preflight never commits an action by itself.

## console.audit · Know who changed what.

Attributed actions, reasons and authoritative references.

Composition: table. Record: AuditEvent. Task: GetOperation.

**Fields:** Read-only facts/selection.

**Visible facts:** 14:02 · Merchant — Refund requested — Operation …9A41; 14:02 · Worker — Provider response interrupted — Reconciliation queued; 14:04 · Support — Case assigned — No second refund.

**Actions:** Filter audit, Open referenced case.

**States:** normal, loading, empty, offline, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family GetOperation; navigation/preflight never commits an action by itself.

## console.settings · Workforce controls.

Console access is separate from owner and customer accounts.

Composition: roles. Record: PermissionGrant. Task: CompleteEvidenceControl.

**Fields:** Read-only facts/selection.

**Visible facts:** Sign-in — Mandatory strong verification; Role — Assigned workforce scope; Sensitive actions — Fresh step-up and audit; Recovery — Authorised procedure.

**Actions:** Review my access, Open security guidance.

**States:** normal, loading, empty, offline, validation, conflict, denied, success.

**Mobile:** single readable task; bottom-safe main action; 20px gutter; explicit back/close; keyboard keeps focused input visible. **Desktop:** frameless task canvas; max 1240px shell, 680px edit measure; contextual preview only if task benefits; no universal side panel.

**Accessibility:** 44px targets; visible focus; named controls; semantic table/list; labelled validation and live status; no essential hover-only content.

**Binding:** Task family CompleteEvidenceControl; navigation/preflight never commits an action by itself.
