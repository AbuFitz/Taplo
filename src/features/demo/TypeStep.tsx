"use client";

import * as React from "react";
import { Check, ChevronRight, Search, X } from "lucide-react";
import { searchIndustries } from "@/features/themes/presets/industries";
import { BusinessIcon } from "./BusinessIcon";
import { applyIndustry } from "./actions";
import { initialState, useDemo } from "./store";
import "./category-picker.css";

const TILES = [
  ["barber", "Barber"],
  ["hairdresser", "Hair salon"],
  ["detailer", "Car detailing"],
  ["plumber", "Plumbing & heating"],
  ["tutor", "Tutor"],
  ["maker", "Shop & handmade"],
  ["hospitality", "Food & drink"],
  ["photographer", "Photography"],
] as const;

export function TypeStep() {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const identity = s.content.identity;
  const [query, setQuery] = React.useState("");
  const [browsing, setBrowsing] = React.useState(false);
  const field = React.useRef<HTMLInputElement>(null);
  const selection = React.useRef<HTMLParagraphElement>(null);
  const trimmed = query.trim();
  const matches = trimmed
    ? searchIndustries(trimmed)
        .filter((p) => p.id !== "other")
        .slice(0, 5)
    : [];
  const selected = Boolean(identity.industryLabel.trim());
  const pick = (id: string, label?: string) => {
    update((x) => applyIndustry(x, id, label));
    setQuery("");
    setBrowsing(false);
    requestAnimationFrame(() =>
      selection.current?.focus({ preventScroll: true }),
    );
  };

  return (
    <div className="sf-stack sf-category-picker" data-testid="type-step">
      <label
        className="sf-business-search-label"
        htmlFor="business-type-search"
      >
        Find your business type
      </label>
      <div className="sf-search">
        <Search aria-hidden="true" />
        <input
          id="business-type-search"
          ref={field}
          type="search"
          aria-label="Search or enter your business type"
          placeholder="Try detailer, tutor or pottery shop"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={80}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-describedby="category-search-hint"
        />
        {query ? (
          <button
            className="sf-search-clear"
            type="button"
            aria-label="Clear business search"
            onClick={() => {
              setQuery("");
              field.current?.focus();
            }}
          >
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <p className="sf-help" id="category-search-hint">
        A starting point, not a box. You can offer more than one thing.
      </p>
      {selected ? (
        <p
          className="sf-category-selection"
          role="status"
          ref={selection}
          tabIndex={-1}
        >
          <Check aria-hidden="true" />
          <span>
            Selected: <strong>{identity.industryLabel}</strong>
          </span>
        </p>
      ) : null}
      {trimmed ? (
        <div className="sf-stack" data-testid="other-type">
          <p className="sf-category-caption" role="status">
            {matches.length
              ? "Choose the closest fit"
              : "No close match? Use your own description."}
          </p>
          {matches.length ? (
            <ul className="sf-results" aria-label="Matching kinds of business">
              {matches.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={selected && identity.industryKey === p.id}
                    onClick={() => pick(p.id)}
                  >
                    <span className="sf-tile-icon">
                      <BusinessIcon id={p.id} />
                    </span>
                    <span>{p.label}</span>
                    <ChevronRight aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            className="sf-category-custom"
            onClick={() => pick("other", trimmed)}
          >
            <BusinessIcon id="other" />
            <span>
              Use “{trimmed}”<small>Keep your own business description</small>
            </span>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <p className="sf-category-caption">
            {browsing ? "More business types" : "Or choose a starting point"}
          </p>
          {browsing ? (
            <ul className="sf-results" aria-label="All business types">
              {searchIndustries("")
                .filter((p) => p.id !== "other")
                .map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      aria-pressed={selected && identity.industryKey === p.id}
                      onClick={() => pick(p.id)}
                    >
                      <span className="sf-tile-icon">
                        <BusinessIcon id={p.id} />
                      </span>
                      <span>{p.label}</span>
                      <ChevronRight aria-hidden="true" />
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            <ul className="sf-tiles" aria-label="Kinds of business">
              {TILES.map(([id, label]) => (
                <li key={id}>
                  <button
                    type="button"
                    className="sf-tile"
                    data-testid={`tile-${id}`}
                    aria-pressed={selected && identity.industryKey === id}
                    onClick={() => pick(id)}
                  >
                    <span className="sf-tile-icon">
                      <BusinessIcon id={id} />
                    </span>
                    <span className="sf-tile-label">{label}</span>
                    {selected && identity.industryKey === id ? (
                      <Check className="sf-tile-check" aria-hidden="true" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="sf-category-options">
            <button
              type="button"
              className="sf-link"
              onClick={() => setBrowsing(!browsing)}
            >
              {browsing ? "Back to starting points" : "Browse all types"}
            </button>
            <button
              type="button"
              className="sf-link"
              data-testid="tile-other"
              onClick={() => field.current?.focus()}
            >
              Something else? Describe it
            </button>
          </div>
        </>
      )}
    </div>
  );
}
