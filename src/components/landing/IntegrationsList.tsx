import {
  MessageCircle,
  CreditCard,
  AtSign,
  HardDrive,
  BarChart3,
  Globe,
} from "lucide-react";

const INTEGRATIONS = [
  {
    icon: MessageCircle,
    name: "WhatsApp",
    description: "Receba pedidos direto no WhatsApp com mensagem pré-pronta.",
  },
  {
    icon: CreditCard,
    name: "Pix e pagamentos",
    description: "Gere QR Code Pix e links de pagamento para cada pedido.",
  },
  {
    icon: AtSign,
    name: "Instagram e TikTok",
    description: "Adicione o link do catálogo na bio das suas redes sociais.",
  },
  {
    icon: HardDrive,
    name: "Google Drive",
    description: "Importe fotos dos produtos direto das suas pastas.",
  },
  {
    icon: BarChart3,
    name: "Relatórios",
    description: "Acompanhe visualizações, cliques e pedidos mais vendidos.",
  },
  {
    icon: Globe,
    name: "Domínio próprio",
    description: "Use seu próprio domínio para deixar sua marca ainda mais forte.",
  },
];

export function IntegrationsList() {
  return (
    <section
      className="bg-gray-50 py-20 md:py-28"
      aria-labelledby="integrations-title"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-600">
              Integrações
            </p>
            <h2
              id="integrations-title"
              className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
            >
              Conecte às ferramentas que você já usa
            </h2>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              O Cataloguei conversa com os apps que fazem parte do seu dia a
              dia. Sua loja integrada, seu trabalho simplificado.
            </p>
            <p className="mt-6 text-sm font-medium text-gray-700">
              Loved by small businesses
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Ajudamos pequenos negócios a se organizarem e venderem mais todos
              os dias.
            </p>
          </div>

          <ul className="space-y-3">
            {INTEGRATIONS.map(({ icon: Icon, name, description }) => (
              <li
                key={name}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{name}</p>
                  <p className="mt-0.5 text-sm text-gray-600">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
