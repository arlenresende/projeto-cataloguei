"use client";

export type AnalyticsEventType =
  | "STORE_VIEW"
  | "PRODUCT_VIEW"
  | "CATEGORY_VIEW"
  | "LINKTREE_VIEW"
  | "WHATSAPP_CLICK"
  | "PRODUCT_WHATSAPP_CLICK"
  | "SHARE_CLICK"
  | "LINKTREE_LINK_CLICK";

type TrackAnalyticsEventInput = {
  type: AnalyticsEventType;
  storeSlug: string;
  productId?: string;
  categorySlug?: string;
  linkId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function trackAnalyticsEvent(input: TrackAnalyticsEventInput) {
  const payload = JSON.stringify({
    ...input,
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/analytics/events", blob);
    return;
  }

  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}
