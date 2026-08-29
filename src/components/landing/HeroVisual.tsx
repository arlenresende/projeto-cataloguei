import {
  MessageCircle,
  Star,
  Camera,
  Search,
  Heart,
  ShoppingBag,
  Box,
} from "lucide-react";
import { getSiteHost } from "@/lib/site-config";

export function HeroVisual() {
  const siteHost = getSiteHost();

  return (
    <div
      className="relative mx-auto mt-16 w-full max-w-4xl md:mt-24"
      aria-hidden="true"
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 -z-10 mx-auto h-full w-3/4 rounded-[40%] bg-gradient-to-tr from-[var(--brand-yellow)]/20 via-[var(--brand-yellow)]/10 to-transparent blur-3xl"
        aria-hidden="true"
      />

      {/* Orbiting tool icons */}
      <div className="pointer-events-none absolute -inset-12 hidden md:block">
        {/* Left side */}
        <OrbitIcon
          className="left-0 top-8"
          color="bg-[var(--brand-yellow-light)] text-[var(--brand-black)]"
          shape="rounded-2xl"
          label="Shopify"
          icon={<Box className="size-6" />}
          animation="float-1"
          delay="0s"
        />
        <OrbitIcon
          className="left-4 top-1/2 -translate-y-1/2"
          color="bg-[var(--brand-yellow)] text-[var(--brand-black)]"
          shape="rounded-2xl"
          label="Instagram"
          icon={<Camera className="size-6" />}
          animation="float-2"
          delay="-1.2s"
        />
        <OrbitIcon
          className="left-0 bottom-8"
          color="bg-[var(--brand-tertiary)] text-[var(--brand-black)]"
          shape="rounded-2xl"
          label="Loja"
          icon={<ShoppingBag className="size-6" />}
          animation="float-3"
          delay="-0.6s"
        />
        {/* Right side */}
        <OrbitIcon
          className="right-0 top-8"
          color="bg-[var(--brand-yellow-light)] text-[var(--brand-black)]"
          shape="rounded-full"
          label="WhatsApp"
          icon={<MessageCircle className="size-6" />}
          animation="float-2"
          delay="-2s"
        />
        <OrbitIcon
          className="right-4 top-1/2 -translate-y-1/2"
          color="bg-[var(--brand-yellow)] text-[var(--brand-black)]"
          shape="rounded-2xl"
          label="Pix"
          icon={<Heart className="size-6" />}
          animation="float-1"
          delay="-2.8s"
        />
        <OrbitIcon
          className="right-0 bottom-8"
          color="bg-[var(--brand-tertiary)] text-[var(--brand-black)]"
          shape="rounded-full"
          label="Google"
          icon={<Search className="size-6" />}
          animation="float-3"
          delay="-1.8s"
        />
      </div>

      {/* Central mockup: catálogo + notificação */}
      <div className="relative mx-auto flex max-w-2xl items-center justify-center">
        {/* Catalog card */}
        <div className="w-full overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white shadow-2xl shadow-black/5">
          <div className="flex items-center justify-between border-b border-[var(--brand-border)] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 px-6">
              <div className="mx-auto h-6 max-w-xs rounded-md bg-[var(--brand-tertiary)] text-center text-[10px] leading-6 text-muted-foreground">
                {siteHost}/techstore
              </div>
            </div>
            <div className="size-6" />
          </div>

          <div className="bg-gradient-to-b from-[var(--brand-tertiary)] to-white px-6 py-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[var(--brand-yellow)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--brand-black)]">TechStore</p>
                <p className="text-[11px] text-muted-foreground">
                  Os melhores produtos de tecnologia
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Fone Pro", price: "R$ 299", tone: "bg-[var(--brand-yellow-light)]" },
                { name: "Capa Premium", price: "R$ 49", tone: "bg-[var(--brand-tertiary)]" },
                { name: "Carregador 65W", price: "R$ 129", tone: "bg-[var(--brand-tertiary)]" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white"
                >
                  <div className={`aspect-square ${item.tone}`} />
                  <div className="p-2">
                    <p className="text-[10px] font-medium text-[var(--brand-black)]">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-semibold text-[var(--brand-black)]">
                      {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating notification card */}
        <div
          className="absolute -bottom-6 left-4 w-56 rounded-xl border border-[var(--brand-border)] bg-white p-3 shadow-xl shadow-black/5 md:-bottom-8 md:left-8 animate-float-1"
          style={{ animationDelay: "-0.4s" }}
        >
          <div className="flex items-start gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-yellow-light)] text-[var(--brand-black)]">
              <MessageCircle className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-[var(--brand-black)]">
                Novo pedido recebido
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                Maria comprou 1x Fone Pro
              </p>
              <p className="mt-1 text-[10px] text-[var(--brand-black)]/60">há 2 min</p>
            </div>
          </div>
        </div>

        {/* Floating rating card */}
        <div
          className="absolute -top-4 right-4 hidden rounded-xl border border-[var(--brand-border)] bg-white p-3 shadow-xl shadow-black/5 md:right-12 md:block animate-float-2"
          style={{ animationDelay: "-1.5s" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-[var(--brand-yellow)] text-[var(--brand-yellow)]"
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-[var(--brand-black)]">
              4.9/5
            </span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
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
  icon: React.ReactNode;
  animation?: "float-1" | "float-2" | "float-3";
  delay?: string;
}

const ANIMATION_CLASS = {
  "float-1": "animate-float-1",
  "float-2": "animate-float-2",
  "float-3": "animate-float-3",
} as const;

function OrbitIcon({
  className = "",
  color,
  shape,
  label,
  icon,
  animation = "float-1",
  delay = "0s",
}: OrbitIconProps) {
  return (
    <div
      className={`absolute flex size-14 items-center justify-center shadow-md ring-1 ring-black/5 ${shape} ${color} ${ANIMATION_CLASS[animation]} ${className}`}
      style={{ animationDelay: delay }}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </div>
  );
}
