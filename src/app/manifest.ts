import type { MetadataRoute } from "next";
import {
  DEFAULT_THEME_COLOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
} from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: DEFAULT_THEME_COLOR,
    lang: "pt-BR",
    categories: ["shopping", "business", "productivity"],
    icons: [
      {
        src: "/brand/cataloguei-mark-180.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/brand/cataloguei-mark-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
