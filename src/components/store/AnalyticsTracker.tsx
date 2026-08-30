"use client";

import { useEffect } from "react";
import {
  trackAnalyticsEvent,
  type AnalyticsEventType,
} from "@/lib/analytics/client";

type AnalyticsTrackerProps = {
  type: AnalyticsEventType;
  storeSlug: string;
  productId?: string;
  categorySlug?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function AnalyticsTracker(props: AnalyticsTrackerProps) {
  const { type, storeSlug, productId, categorySlug, metadata } = props;

  useEffect(() => {
    const trackingKey = [
      "cataloguei:analytics",
      type,
      storeSlug,
      productId || "",
      categorySlug || "",
      window.location.pathname,
      window.location.search,
    ].join(":");

    if (window.sessionStorage.getItem(trackingKey)) {
      return;
    }

    window.sessionStorage.setItem(trackingKey, "1");
    trackAnalyticsEvent({ type, storeSlug, productId, categorySlug, metadata });
  }, [categorySlug, metadata, productId, storeSlug, type]);

  return null;
}
