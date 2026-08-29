import { ImageResponse } from "next/og";
import { getPublicStoreBySlug } from "@/lib/store-data";
import { DEFAULT_THEME_COLOR, SITE_NAME, toAbsoluteAssetUrl } from "@/lib/site-config";
import { truncateText } from "@/lib/seo";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ storeUrl: string }> }
) {
  const { storeUrl } = await params;
  const store = await getPublicStoreBySlug(storeUrl);

  if (!store) {
    return new Response("Loja não encontrada.", { status: 404 });
  }

  const storeImage = toAbsoluteAssetUrl(store.heroes[0]?.image || store.logo || "/favicon.ico");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          gap: 32,
          background:
            "linear-gradient(135deg, #18181b 0%, #27272a 55%, #3f3f46 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 24,
              color: "#d4d4d8",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: DEFAULT_THEME_COLOR,
              }}
            />
            {SITE_NAME}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 62,
                lineHeight: 1.03,
                fontWeight: 900,
              }}
            >
              {store.name}
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.35,
                color: "#d4d4d8",
              }}
            >
              {truncateText(store.description || `Conheça a loja ${store.name}.`, 180)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 22,
              color: "#a1a1aa",
            }}
          >
            <div>{store.city || store.state ? [store.city, store.state].filter(Boolean).join(" - ") : "Loja pública no Cataloguei"}</div>
            <div>{store.products.length} produtos ativos</div>
          </div>
        </div>

        <div
          style={{
            width: 360,
            borderRadius: 32,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={storeImage || toAbsoluteAssetUrl("/favicon.ico") || ""}
            alt={store.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
