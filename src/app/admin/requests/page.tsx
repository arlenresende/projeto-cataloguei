import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserBillingState, serializeBillingState } from "@/lib/billing/subscription";
import {
  isAdminUser,
  listFeatureRequests,
} from "@/lib/feature-requests";
import { RequestsContent } from "./requests-content";

export default async function RequestsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const isAdmin = await isAdminUser({
    userId: session.user.id,
    email: session.user.email,
  });
  const [billingState, requests] = await Promise.all([
    getUserBillingState(session.user.id),
    listFeatureRequests({
      userId: session.user.id,
      isAdmin,
    }),
  ]);

  return (
    <RequestsContent
      billing={serializeBillingState(billingState)}
      isAdmin={isAdmin}
      initialRequests={requests.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }))}
    />
  );
}
