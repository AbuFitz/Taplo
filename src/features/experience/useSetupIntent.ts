"use client";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
/** Deep links open the actual editor/form; no duplicate setup records or simulated completion. */
export function useSetupIntent(name: string, run: () => void, ready = true) {
  const params = useSearchParams(),
    path = usePathname(),
    router = useRouter();
  const intent = params.get(name),
    handled = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!intent || !ready || handled.current === `${path}:${name}:${intent}`)
      return;
    handled.current = `${path}:${name}:${intent}`;
    run();
    const next = new URLSearchParams(params.toString());
    next.delete(name);
    router.replace(`${path}${next.size ? `?${next}` : ""}`, { scroll: false });
  }, [intent, name, path, params, ready, router, run]);
  return intent;
}
