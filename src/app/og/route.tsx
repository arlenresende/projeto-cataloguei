import { ImageResponse } from "next/og";
import {
  DEFAULT_THEME_COLOR,
  getSiteHost,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site-config";

export const revalidate = 3600;

export async function GET() {
  const siteHost = getSiteHost();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background:
            "linear-gradient(135deg, #faf5ff 0%, #ffffff 45%, #ede9fe 100%)",
          color: "#18181b",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 24,
              background: DEFAULT_THEME_COLOR,
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            C
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 860,
          }}
        >
          <div
            style={{
              fontSize: 62,
              lineHeight: 1.05,
              fontWeight: 900,
            }}
          >
            Catálogo online pronto para vender mais
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              color: "#52525b",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#71717a",
          }}
        >
          <div>{siteHost}</div>
          <div>Lojas, produtos e SEO profissional</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
