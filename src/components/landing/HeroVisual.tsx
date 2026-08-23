import { MessageCircle, Star } from "lucide-react";

export function HeroVisual() {
  return (
    <div
      className="relative mx-auto mt-16 w-full max-w-4xl"
      aria-hidden="true"
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 -z-10 mx-auto h-full w-3/4 rounded-[40%] bg-gradient-to-tr from-indigo-200/40 via-blue-100/30 to-transparent blur-3xl"
        aria-hidden="true"
      />

      {/* Orbiting tool icons */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <OrbitIcon
          className="left-2 top-8"
          color="bg-orange-100 text-orange-600"
          shape="rounded-2xl"
          label="Shopify"
        />
        <OrbitIcon
          className="right-4 top-12"
          color="bg-blue-100 text-blue-600"
          shape="rounded-full"
          label="WhatsApp"
        />
        <OrbitIcon
          className="left-10 top-1/2 -translate-y-1/2"
          color="bg-purple-100 text-purple-600"
          shape="rounded-2xl"
          label="Instagram"
        />
        <OrbitIcon
          className="right-12 top-1/2 -translate-y-1/2"
          color="bg-emerald-100 text-emerald-600"
          shape="rounded-2xl"
          label="Pix"
        />
        <OrbitIcon
          className="left-1/4 bottom-6"
          color="bg-pink-100 text-pink-600"
          shape="rounded-2xl"
          label="Loja"
        />
        <OrbitIcon
          className="right-1/4 bottom-2"
          color="bg-yellow-100 text-yellow-700"
          shape="rounded-full"
          label="Google"
        />
      </div>

      {/* Central mockup: catálogo + notificação */}
      <div className="relative mx-auto flex max-w-2xl items-center justify-center">
        {/* Catalog card */}
        <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-indigo-100/60">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 px-6">
              <div className="mx-auto h-6 max-w-xs rounded-md bg-gray-50 text-center text-[10px] leading-6 text-gray-400">
                cataloguei.com.br/techstore
              </div>
            </div>
            <div className="size-6" />
          </div>

          <div className="bg-gradient-to-b from-indigo-50/40 to-white px-6 py-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-gray-900" />
              <div>
                <p className="text-sm font-semibold text-gray-900">TechStore</p>
                <p className="text-[11px] text-gray-500">
                  Os melhores produtos de tecnologia
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Fone Pro", price: "R$ 299", tone: "bg-indigo-50" },
                { name: "Capa Premium", price: "R$ 49", tone: "bg-pink-50" },
                { name: "Carregador 65W", price: "R$ 129", tone: "bg-emerald-50" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="overflow-hidden rounded-lg border border-gray-100 bg-white"
                >
                  <div className={`aspect-square ${item.tone}`} />
                  <div className="p-2">
                    <p className="text-[10px] font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-semibold text-indigo-600">
                      {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating notification card */}
        <div className="absolute -bottom-6 left-4 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl shadow-indigo-100 md:-bottom-8 md:left-8">
          <div className="flex items-start gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <MessageCircle className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-gray-900">
                Novo pedido recebido
              </p>
              <p className="truncate text-[10px] text-gray-500">
                Maria comprou 1x Fone Pro
              </p>
              <p className="mt-1 text-[10px] text-emerald-600">há 2 min</p>
            </div>
          </div>
        </div>

        {/* Floating rating card */}
        <div className="absolute -top-4 right-4 hidden rounded-xl border border-gray-200 bg-white p-3 shadow-xl shadow-indigo-100 md:right-12 md:block">
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-gray-900">
              4.9/5
            </span>
          </div>
          <p className="mt-1 text-[10px] text-gray-500">
            +1.200 lojistas ativos
          </p>
        </div>
      </div>
    </div>
  );
}

interface OrbitIconProps {
  className?: string;
  color: string;
  shape: string;
  label: string;
}

function OrbitIcon({ className = "", color, shape, label }: OrbitIconProps) {
  return (
    <div
      className={`absolute flex size-12 items-center justify-center shadow-sm ${shape} ${color} ${className}`}
    >
      <span className="text-[10px] font-semibold">{label.charAt(0)}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
