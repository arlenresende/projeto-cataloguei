const LOGOS = [
  "TechStore",
  "Sabor & Arte",
  "Moda Elegante",
  "PetShop+",
  "Beleza Pura",
  "Casa Verde",
];

export function LogoCloud() {
  return (
    <section
      className="border-y border-[var(--brand-border)] bg-[var(--brand-tertiary)] py-12 md:py-16"
      aria-label="Empresas que confiam"
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
          Usado por pequenos negócios de todos os segmentos
        </p>
        <ul className="grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
          {LOGOS.map((logo) => (
            <li
              key={logo}
              className="text-base font-semibold text-muted-foreground transition-colors hover:text-[var(--brand-black)] sm:text-lg"
            >
              {logo}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
