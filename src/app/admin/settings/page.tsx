import { THEME_SEGMENTS, THEME_CONFIGS } from "@/lib/themes";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Configurações</h1>

      <div className="space-y-6">
        {/* Store Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informações da Loja
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Loja
              </label>
              <input
                type="text"
                defaultValue="Minha Loja"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                defaultValue="Descrição da minha loja"
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="text"
                defaultValue="5511999999999"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tema</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {THEME_SEGMENTS.map((segment) => {
              const theme = THEME_CONFIGS[segment];
              return (
                <button
                  key={segment}
                  className="p-3 rounded-lg border border-gray-200 text-center hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div
                    className="size-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Cores Personalizadas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor Primária
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#2563EB"
                  className="size-10 rounded border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue="#2563EB"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor Secundária
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#1E293B"
                  className="size-10 rounded border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue="#1E293B"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
