# Platform typography (Taplo's own, not customer pages)

**Decision (23 Oct 2026): Inter. Headings use Inter at its Display optical size (opsz 32), weight 700, tracking −0.034em. Body, UI and numerals use Inter at text size.**

Method: the supplied logo (`public/logo/taplo-horizontal-black.svg`) and real Taplo copy ("Your Taplo, ready to share.", price and time strings) were set in four candidates side by side (`shots/type-inter.png`): Inter Display 700, Inter Display 800, Inter text-size 700, Geist 760.

- Inter Display 700 sits comfortably beside the logo: the logo is a geometric sans with a folded T symbol; Inter Display is neutral and precise without competing with it. Tight tracking and larger counters stay clear at 50 px+.
- Inter Display 800 and Geist 760 read louder than the logo and make the wordmark look quiet.
- Inter at text optical size is wider and looser at display sizes; it is only used for UI and body.
- Tabular numerals (`tabular-nums`) keep prices and times aligned.

Implementation: one file, `@fontsource-variable/inter/opsz.css` (OFL; has `wght` 100-900 and `opsz` 14-32). `.font-display` forces `opsz 32`. Business pages set `font-optical-sizing: none` on `[data-taplo-theme]`, so a customer who chose "Inter" gets exactly the text-size design they had before; customer font choices are unchanged and independent.

## Round four: Geist replaces Inter Display (23 October 2026)

The three directions in `docs/directions/` were set in Geist (A), Inter Display (B) and Instrument Serif with Inter (C). Direction A was chosen for the platform. Geist at 800 weight and −0.055 em is heavier and more architectural than Inter Display against the geometric Taplo wordmark, and it holds up at the very large sizes the hero now uses. Body and interface text are Geist at 400 to 600. Customer pages are unaffected: they keep their own font choices, and Instrument Serif belongs to the customer-page designs, not the platform.
