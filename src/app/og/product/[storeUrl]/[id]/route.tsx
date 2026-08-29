import { ImageResponse } from "next/og";
import { getPublicProductByIdentifier } from "@/lib/store-data";
import { DEFAULT_THEME_COLOR, SITE_NAME, toAbsoluteAssetUrl } from "@/lib/site-config";
import { getRealProductImages, truncateText } from "@/lib/seo";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ storeUrl: string; id: string }> }
) {
  const { storeUrl, id } = await params;
  const result = await getPublicProductByIdentifier(storeUrl, id);

  if (!result) {
    return new Response("Produto não encontrado.", { status: 404 });
  }

  const { store, product } = result;
  const productImage = toAbsoluteAssetUrl(
    getRealProductImages(product.images || [], product.imageUrl)[0] ||
      store.logo ||
      "/placeholder-product.svg"
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 42,
          gap: 28,
          background:
            "linear-gradient(135deg, #ffffff 0%, #faf5ff 52%, #ede9fe 100%)",
          color: "#18181b",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              color: "#52525b",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: DEFAULT_THEME_COLOR,
              }}
            />
            {store.name} no {SITE_NAME}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div
              style={{
                fontSize: 56,
                lineHeight: 1.03,
                fontWeight: 900,
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.3,
                color: "#52525b",
              }}
            >
              {truncateText(product.seoDescription || product.description, 170)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#18181b",
              }}
            >
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div
              style={{
                fontSize: 22,
                color: "#71717a",
              }}
            >
              {product.category} {product.brand ? `• ${product.brand}` : ""}
            </div>
          </div>
        </div>

        <div
          style={{
            width: 420,
            borderRadius: 30,
            overflow: "hidden",
            background: "#ffffff",
            border: "1px solid rgba(24,24,27,0.08)",
            display: "flex",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage || toAbsoluteAssetUrl("/placeholder-product.svg") || ""}
            alt={product.name}
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
