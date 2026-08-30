import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  variant?: "header" | "sidebar" | "footer" | "mark";
  className?: string;
};

const LOGO_CONFIG = {
  header: {
    src: "/cataloguei-logo.svg",
    width: 420,
    height: 100,
    className: "h-12 w-auto md:h-14",
  },
  sidebar: {
    src: "/cataloguei-logo.svg",
    width: 420,
    height: 100,
    className: "h-12 w-auto md:h-14",
  },
  footer: {
    src: "/cataloguei-footer-logo.svg",
    width: 226,
    height: 48,
    className: "h-14 w-auto",
  },
  mark: {
    src: "/cataloguei-mark.svg",
    width: 90,
    height: 106,
    className: "size-9",
  },
} as const;

export function BrandLogo({
  href = "/",
  variant = "header",
  className,
}: BrandLogoProps) {
  const config = LOGO_CONFIG[variant];
  const logo = (
    <Image
      src={config.src}
      alt="Cataloguei"
      width={config.width}
      height={config.height}
      priority={variant === "header"}
      className={cn(config.className, className)}
    />
  );

  if (!href) {
    return logo;
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center transition-opacity hover:opacity-70"
      aria-label="Cataloguei - Página inicial"
    >
      {logo}
    </Link>
  );
}
