/** The one place wall-clock time is read, so event handlers and tests have a single seam. */
export const nowMs = (): number => Date.now()
