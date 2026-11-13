/**
 * Consent-aware event hook. Nothing is sent unless a consent manager has set
 * window.rrConsent = { analytics: true } and a tag manager dataLayer exists.
 * No analytics tool is installed yet; this only prepares the events.
 */
export type PlannerEvent =
  | "planner_started"
  | "planner_step_completed"
  | "planner_venue_viewed"
  | "planner_completed"
  | "planner_enquiry_submitted"
  | "planner_enquiry_failed";

type Win = Window & { rrConsent?: { analytics?: boolean }; dataLayer?: Record<string, unknown>[] };

export function track(
  event: PlannerEvent,
  props: Record<string, string | number | boolean | null> = {},
) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  if (!w.rrConsent?.analytics || !Array.isArray(w.dataLayer)) return;
  // Never include personal contact details in props.
  w.dataLayer.push({ event, ...props });
}
