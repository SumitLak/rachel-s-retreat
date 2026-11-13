import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Anonymous shortlist stored in this browser only (no account, no email).
 * It does not sync across devices. Safe during SSR: starts empty and loads
 * after mount, so server and client markup match.
 */
const KEY = "rr-saved-retreats";
const EVENT = "rr-saved-retreats-change";

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    /* storage unavailable (private mode etc.) */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useSavedRetreats() {
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(read());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    write(next);
    if (!current.includes(slug)) track("retreat_saved", { retreat: slug });
  }, []);

  return { saved, ready, isSaved: (slug: string) => saved.includes(slug), toggle };
}
