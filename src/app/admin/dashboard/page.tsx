import { DashboardContent } from "./dashboard-content";

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

export default function DashboardPage() {
  return <DashboardContent stats={stats} />;
}
