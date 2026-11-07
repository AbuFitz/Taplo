/** Keep room for navigation, a useful form body and its persistent action row. */
export function previewLimits(viewportHeight: number) {
  const max = Math.max(
    96,
    Math.min(
      600,
      Math.floor(viewportHeight - 380),
      Math.floor(viewportHeight * 0.58),
    ),
  );
  return { min: Math.min(140, max), max };
}

export function clampPreviewHeight(value: number, viewportHeight: number) {
  const { min, max } = previewLimits(viewportHeight);
  return Math.round(Math.max(min, Math.min(max, value)));
}
