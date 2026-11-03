"use client";
import { useCallback, useSyncExternalStore } from "react";
const EVENT = "taplo:journey-preference";
const subscribe = (f: () => void) => {
  window.addEventListener(EVENT, f);
  window.addEventListener("storage", f);
  return () => {
    window.removeEventListener(EVENT, f);
    window.removeEventListener("storage", f);
  };
};
/** Optional learning preferences are separate from business data and editor undo. */
export function useJourneyPreference(business: string, topic: string) {
  const key = `taplo.guidance.v2.${encodeURIComponent(business)}.${topic}`;
  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key) ?? "";
      } catch {
        return "";
      }
    },
    () => "",
  );
  const set = useCallback(
    (v: string) => {
      try {
        localStorage.setItem(key, v);
      } catch {
        /* Learning remains usable without storage. */
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return [value, set] as const;
}
