"use client";
import { PAGE_FINISHES, type FinishId } from "./finishes";
import "./finish-studio.css";
export function FinishPicker({
  value,
  onChange,
}: {
  value?: FinishId;
  onChange: (id: FinishId) => void;
}) {
  return (
    <fieldset className="finish-studio">
      <legend>Page finish</legend>
      <div className="finish-grid" role="radiogroup" aria-label="Page finish">
        {PAGE_FINISHES.map((f) => (
          <label key={f.id} className="finish-choice">
            <input
              type="radio"
              name="page-finish"
              aria-label={f.name}
              checked={value === f.id}
              onChange={() => onChange(f.id)}
            />
            <span
              className="finish-scene"
              data-moving={f.background.kind !== "solid" || undefined}
              data-tone={f.tone}
              style={{ background: f.preview }}
            >
              <span
                className="finish-mini-profile"
                style={{ background: f.colors.surface, color: f.colors.text }}
              >
                <i style={{ background: f.colors.accent }} />
                <b />
                <b />
              </span>
              <span
                className="finish-mini-block"
                style={{ background: f.colors.surface }}
              />
              <span
                className="finish-mini-button"
                style={{ background: f.colors.accent }}
              />
            </span>
            <span>{f.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
