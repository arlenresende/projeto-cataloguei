import {
  Package,
  Eye,
  TrendingUp,
  MessageCircle,
} from "lucide-react";

const stats = [
  {
    label: "Produtos",
    value: "12",
    icon: Package,
    change: "+2 esta semana",
  },
  {
    label: "Visualizações",
    value: "1.234",
    icon: Eye,
    change: "+15% este mês",
  },
  {
    label: "Cliques WhatsApp",
    value: "89",
    icon: MessageCircle,
    change: "+8 esta semana",
  },
  {
    label: "Conversão",
    value: "7.2%",
    icon: TrendingUp,
    change: "+0.5% este mês",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                {stat.label}
              </span>
              <stat.icon className="size-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-green-600 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Atividade Recente
        </h2>
        <p className="text-gray-500 text-sm">
          Nenhuma atividade recente. Comece adicionando seus primeiros produtos!
        </p>
      </div>
    </div>
  );
}
