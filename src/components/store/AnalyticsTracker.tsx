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
    trackAnalyticsEvent({ type, storeSlug, productId, categorySlug, metadata });
  }, [categorySlug, metadata, productId, storeSlug, type]);

  return null;
}
