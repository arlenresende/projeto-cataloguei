import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbLink {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbLink[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--theme-text)", opacity: 0.7 }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-bold" : "font-medium"}
                  style={{ color: "var(--theme-text)", opacity: isLast ? 1 : 0.7 }}
                >
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight
                  aria-hidden="true"
                  className="size-4"
                  style={{ color: "var(--theme-text)", opacity: 0.35 }}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
