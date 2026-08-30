"use client";

import { ExternalLink } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

type TrackedLinktreeLinkProps = {
  linkId: string;
  href: string;
  title: string;
  label: string;
  color: string;
  textColor: string;
  storeSlug: string;
};

export function TrackedLinktreeLink({
  linkId,
  href,
  title,
  label,
  color,
  textColor,
  storeSlug,
}: TrackedLinktreeLinkProps) {
  function handleClick() {
    trackAnalyticsEvent({
      type: "LINKTREE_LINK_CLICK",
      storeSlug,
      linkId,
      metadata: { linkType: label },
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
      style={{
        backgroundColor: color + "15",
        color: textColor,
        border: `1px solid ${color}25`,
      }}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
        style={{ backgroundColor: color + "bb" }}
      >
        {label.charAt(0)}
      </span>
      <span className="flex-1 truncate text-left">{title}</span>
      <ExternalLink
        size={16}
        className="shrink-0 opacity-25 transition-opacity group-hover:opacity-50"
      />
    </a>
  );
}
