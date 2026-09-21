"use client";

type GoogleAnalyticsEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: GoogleAnalyticsEventParams
    ) => void;
  }
}

export function trackGoogleEvent(
  eventName: string,
  params?: GoogleAnalyticsEventParams
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}
