import { THEME_SEGMENTS, THEME_CONFIGS } from "@/lib/themes";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações da sua loja"
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-base font-semibold text-[var(--brand-black)]">
            Informações da Loja
          </h2>
          <div className="mt-5 space-y-4">
            <Input
              label="Nome da Loja"
              defaultValue="Minha Loja"
            />
            <Textarea
              label="Descrição"
              defaultValue="Descrição da minha loja"
              rows={3}
            />
            <Input
              label="WhatsApp"
              defaultValue="5511999999999"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button>Salvar alterações</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-[var(--brand-black)]">
            Tema
          </h2>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {THEME_SEGMENTS.map((segment) => {
              const theme = THEME_CONFIGS[segment];
              return (
                <button
                  key={segment}
                  className="flex flex-col items-center gap-2 rounded-lg border border-[var(--brand-border)] p-3 text-center transition-all hover:border-[var(--brand-black)] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
                >
                  <div
                    className="size-8 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span className="text-xs font-medium text-[var(--brand-black)]">
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-[var(--brand-black)]">
            Cores Personalizadas
          </h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
                Cor Primária
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#2563EB"
                  className="size-10 cursor-pointer rounded-lg border border-[var(--brand-border)]"
                />
                <input
                  type="text"
                  defaultValue="#2563EB"
                  className="h-10 flex-1 rounded-lg border border-[var(--brand-border)] px-3.5 font-mono text-sm text-[var(--brand-black)] transition-colors focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
                Cor Secundária
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#1E293B"
                  className="size-10 cursor-pointer rounded-lg border border-[var(--brand-border)]"
                />
                <input
                  type="text"
                  defaultValue="#1E293B"
                  className="h-10 flex-1 rounded-lg border border-[var(--brand-border)] px-3.5 font-mono text-sm text-[var(--brand-black)] transition-colors focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
