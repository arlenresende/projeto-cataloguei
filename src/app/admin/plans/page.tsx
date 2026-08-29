import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserBillingState, serializeBillingState } from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";
import { PlansContent } from "./plans-content";

export default async function PlansPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const billing = serializeBillingState(
    await getUserBillingState(session.user.id)
  );
  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const [products, activeBanners, imageCount] = store
    ? await Promise.all([
        prisma.product.count({ where: { storeId: store.id } }),
        prisma.storeHero.count({ where: { storeId: store.id, isActive: true } }),
        prisma.productImage.count({
          where: {
            product: {
              storeId: store.id,
            },
          },
        }),
      ])
    : [0, 0, 0];

  const params = await searchParams;

  return (
    <PlansContent
      billing={billing}
      usage={{
        products,
        activeBanners,
        images: imageCount,
      }}
      paymentSuccess={params.payment === "success"}
    />
  );
}
