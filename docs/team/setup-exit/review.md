# Setup header: logo and exit

Feedback (one user): they did not realise tapping the logo during setup returns to the home page.

## Decision
- The logo is branding only during setup. It no longer navigates.
- A labelled **Save and exit** link states the exit and where it leads; its title says progress is saved on this device.
- Test: tapping the logo stays on the form; Save and exit returns home and the draft is still there on return.

## Options rejected
- Confirmation dialog on every logo tap: friction for a rare action, and the labelled link already covers intent.
- Keeping the link and adding a tooltip: touch users have no hover.

## Open
A "Continue setup" entry on the home page and nav for returning visitors is not built. Metric to watch once instrumentation exists: share of setup sessions that exit before step 3 and return within a day. Targets are provisional.
