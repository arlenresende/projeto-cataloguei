import { headers } from "next/headers";
import { DashboardContent } from "./dashboard-content";
import { auth } from "@/lib/auth";
import { getUserBillingState, serializeBillingState } from "@/lib/billing/subscription";

const stats = [
  {
    title: "Produtos",
    value: "12",
    subtitle: "+2 esta semana",
  },
  {
    title: "Visualizações",
    value: "1.234",
    subtitle: "+15% este mês",
    dark: true,
  },
  {
    title: "Cliques WhatsApp",
    value: "89",
    subtitle: "+8 esta semana",
  },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const billing = session
    ? serializeBillingState(await getUserBillingState(session.user.id))
    : null;

  return <DashboardContent stats={stats} billing={billing} />;
}
