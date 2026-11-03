# Taplo messaging: source of truth

Every word on the marketing site, in setup and in the product's own empty states is checked against this file.
If a claim is not in the "Supported now" table, it does not go on the site.

## Audience
Owners of local service businesses, shops and dealers who need one good page people can act on: barbers and salons, trades, car dealers, makers and shops, clinics, tutors, cafés. They are not designers and do not want a website project. They are on their phone most of the day.

## Positioning
Taplo gives a business **one page that does the work of a website**: what you do, what it costs, who you are, and a clear way to book or ask. You share it as a link, a QR code or an image.

It is built for the first thing a customer does: look, decide, act. It is not a general website builder and does not try to be.

## Terminology (approved)
| Say | Not | Why |
| --- | --- | --- |
| **your Taplo** (the page), "your Taplo page" on first mention | landing page, microsite, profile page, link-in-bio | One memorable noun. Introduce as "your Taplo, the one page for your business". |
| business profile | listing | Only when explaining what a Taplo is to someone who has not seen one. |
| content (Services, Products, Vehicles, Photos, Team, Reviews, Questions) | widgets, blocks, components | Owners think in what they offer. |
| look | theme, template | A look is a starting point you can change completely. |
| booking, request, enquiry (used precisely, see below) | appointment request (ambiguous) | They mean three different things. |
| team | staff | Friendlier. "Staff" is used only in settings. |
| share | publish a link | |

Precise action words: **Book** = a time is confirmed immediately. **Request** = a time is asked for and the business accepts or declines. **Enquire / Send a message** = nothing is reserved.

Action labels: primary call to action is **Make your Taplo** in navigation and hero; **Start free** next to plan prices; **Log in** for returning owners. In preview mode the same labels lead to the demo setup, never to a pretend sign-up.

## Tone
Plain, specific, a little warm. Short sentences. Say what happens.
- Yes: "Customers pick a time. You get a request and accept it."
- Yes: "Reserved and sold stay on your page, so your records stay complete."
- No: "Revolutionise your online presence." / "Supercharge your brand." / "All-in-one platform." / "Seamless." / "Unlock." / "Empower." / "Next-level." / "Game-changing."

## Rejected generic phrases
"A page that looks like your business" (every builder says it), "No website. No design skills." as a headline, "Everything your business does. One page." as a hero (grand, says nothing a person can picture), "beautiful", "stunning", "effortless", "in minutes" without evidence, "trusted by" (no customers are claimed).

## Supported now (in the preview) and what is not
| Capability | Preview today | Connected product |
| --- | --- | --- |
| Your Taplo page with looks, colours, fonts, header, buttons, cards, wallpaper | ✅ real | needs accounts to persist |
| Services and price menus with detail views | ✅ | |
| Booking: pick a service, a person, a time; confirmed or requested; cancel and reschedule rules | ✅ in this browser | Server logic is written and tested on Postgres 16; needs a Supabase project to be live |
| Owner calendar: agenda, day, week, month, block time, working hours, accept or decline | ✅ in this browser | same |
| Contact form (enquiry, no time reserved) | ✅ in this browser | stored by the server function; email delivery needs a provider |
| Products, vehicles, affiliate links, availability (reserved, sold) | ✅ | |
| Team profiles with services, qualifications and booking with a person | ✅ (booking with a person needs the Business plan) | |
| Gallery with lightbox, reviews with provenance, opening hours with open-now, location and service area, questions | ✅ | |
| Share: link, QR code, image, native share | ✅ link is a preview link | public link needs publishing |
| Emails and texts to customers | ❌ not sent | needs an email/SMS provider |
| Payments, deposits, checkout | ❌ not connected, the widget stays off | needs Stripe |
| Public publishing, custom domains, analytics | ❌ | needs accounts, hosting integration |

Never write that a booking "is emailed", that a customer "pays", or that a page is "live" unless the row above says connected.

## Benefits (concrete)
1. Customers can see prices and ask or book without phoning.
2. The page is the same on a phone and a laptop, and works from a QR code on the counter.
3. You choose how it looks, down to colours and type, and keep your words and prices fixed while you try things.
4. Cars, products and services share one tidy way to show status: available, reserved, sold.
5. You always see what is waiting for a reply.

## Plans
Plans and prices come from `src/features/subscriptions/plans.ts` and entitlements from `entitlements.ts`. Marketing copy may only restate those. Where a plan limits looks or features, the pricing page says so in the same words the editor uses.

## Decision: "your Taplo" (evaluated this phase)

- **Kept for the action only.** "Make your Taplo" is the primary action everywhere (header, hero, footer, pricing, onboarding title). It is short, ownable and says what happens.
- **Body copy says "page" or "Taplo page".** "Your Taplo" as a noun in running text read as jargon in testing the copy aloud ("share your Taplo" sounds like sharing the product), so sentences use "your page", "a Taplo page" or the business name.
- **"Business profile"** appears only where someone needs the thing explained from nothing (the product index), never as the name.
- Everything that links to setup uses the same label; `primaryAction()` in `src/features/marketing/Site.tsx` is the single source, and the e2e suite checks the label and destination.

## Rejected phrases now removed from the site
"Create your page", "Everything your business does. One page.", "See it change", "Try the looks" as a primary action (it remains a secondary link to the lab), "Features" and "Industries" as navigation labels (replaced by Product and Inspiration, each with real destinations).
