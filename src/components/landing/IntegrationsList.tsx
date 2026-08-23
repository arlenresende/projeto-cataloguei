import {
  MessageCircle,
  Camera,
  Link2,
  QrCode,
  Globe,
  Layout,
} from "lucide-react";

const CHANNELS = [
  {
    icon: MessageCircle,
    name: "WhatsApp",
    description:
      "Receba clientes diretamente pelo WhatsApp através da sua página.",
  },
  {
    icon: Camera,
    name: "Instagram",
    description:
      "Coloque seu link na bio e transforme seus seguidores em clientes.",
  },
  {
    icon: Link2,
    name: "Link compartilhável",
    description:
      "Envie sua página pelo WhatsApp, redes sociais ou onde quiser.",
  },
  {
    icon: QrCode,
    name: "QR Code",
    description:
      "Gere um QR Code para divulgar sua página em materiais físicos.",
  },
  {
    icon: Globe,
    name: "Domínio personalizado",
    description: "Tenha um endereço próprio para apresentar seu negócio.",
  },
  {
    icon: Layout,
    name: "Página profissional",
    description:
      "Mostre seus produtos ou serviços de forma clara, bonita e profissional.",
  },
];

export function IntegrationsList() {
  return (
    <section
      className="bg-zinc-50 py-20 md:py-28"
      aria-labelledby="divulgacao-title"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-violet-600">
              DIVULGAÇÃO
            </p>
            <h2
              id="divulgacao-title"
              className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl"
            >
              Leve sua página para onde seus clientes estão
            </h2>
            <p className="mt-4 text-base text-zinc-500 md:text-lg">
              Compartilhe seu catálogo em poucos cliques e facilite o contato
              com quem quer comprar ou pedir um orçamento.
            </p>
            <p className="mt-6 text-sm font-medium text-zinc-700">
              Feito para pequenos negócios
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Uma página profissional para divulgar seu trabalho onde seus
              clientes já estão.
            </p>
          </div>

          <ul className="space-y-3">
            {CHANNELS.map(({ icon: Icon, name, description }) => (
              <li
                key={name}
                className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{name}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
