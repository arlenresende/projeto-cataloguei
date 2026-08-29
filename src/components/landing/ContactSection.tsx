import { MessageCircle, Heart, Send, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, CONTACT_WHATSAPP } from "@/lib/site-config";

const SUBJECTS = [
  "Tenho uma dúvida",
  "Quero fazer uma sugestão",
  "Encontrei um problema",
  "Quero sugerir uma funcionalidade",
  "Quero conversar sobre outra coisa",
];

export function ContactSection() {
  const contactWhatsappHref = CONTACT_WHATSAPP?.replace(/\D/g, "");

  return (
    <>
      {/* Hero */}
      <section
        id="contato"
        className="bg-white py-20 md:py-28"
        aria-labelledby="contact-title"
      >
        <div className="mx-auto max-w-2xl px-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-[var(--brand-yellow-light)] p-3 text-[var(--brand-black)]">
            <MessageCircle className="size-6" />
          </span>
          <h2
            id="contact-title"
            className="mt-6 text-3xl font-bold tracking-tight text-[var(--brand-black)] md:text-4xl lg:text-5xl"
          >
            Tem alguma dúvida? Vamos conversar.
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Se você não encontrou o que precisava, ficou com alguma dúvida ou
            simplesmente quer compartilhar uma ideia, fale com a gente. Estamos
            aqui para ouvir.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Sua sugestão pode ajudar a melhorar o produto para todo mundo.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-[var(--brand-tertiary)] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left side */}
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[var(--brand-black)]">
                FALE CONOSCO
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--brand-black)] md:text-4xl">
                Envie sua mensagem
              </h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                Responderemos o mais rápido possível. Sua opinião é importante
                para construirmos um produto melhor.
              </p>

              <div className="mt-8 space-y-4">
                {CONTACT_EMAIL ? (
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-yellow-light)] text-[var(--brand-black)]">
                      <Mail className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-black)]">E-mail</p>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="mt-0.5 inline-flex text-sm text-muted-foreground transition-colors hover:text-[var(--brand-black)]"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                ) : null}
                {CONTACT_WHATSAPP && contactWhatsappHref ? (
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-yellow-light)] text-[var(--brand-black)]">
                      <Phone className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-black)]">
                        WhatsApp
                      </p>
                      <a
                        href={`https://wa.me/${contactWhatsappHref}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex text-sm text-muted-foreground transition-colors hover:text-[var(--brand-black)]"
                      >
                        {CONTACT_WHATSAPP}
                      </a>
                    </div>
                  </div>
                ) : null}
                {!CONTACT_EMAIL && !CONTACT_WHATSAPP ? (
                  <p className="text-sm text-muted-foreground">
                    Os canais oficiais de atendimento podem ser configurados por ambiente
                    para evitar dados fictícios na página pública.
                  </p>
                ) : null}
              </div>
            </div>

            {/* Right side - Form */}
            <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-6 shadow-sm md:p-8">
              <form className="space-y-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]"
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    placeholder="Como podemos te chamar?"
                    className="block h-10 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm text-[var(--brand-black)] placeholder:text-muted-foreground focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    placeholder="seu@email.com"
                    className="block h-10 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm text-[var(--brand-black)] placeholder:text-muted-foreground focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]"
                  >
                    Assunto
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    defaultValue=""
                    className="block h-10 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm text-[var(--brand-black)] focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
                  >
                    <option value="" disabled>
                      Selecione um assunto
                    </option>
                    {SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Conte um pouco mais sobre o que você precisa..."
                    className="block w-full resize-none rounded-lg border border-[var(--brand-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--brand-black)] placeholder:text-muted-foreground focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10"
                  />
                </div>

                <Button size="lg" className="w-full">
                  <Send className="mr-2 size-4" />
                  Enviar mensagem
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Final block */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-[var(--brand-yellow-light)] p-3 text-[var(--brand-black)]">
            <Heart className="size-6" />
          </span>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-[var(--brand-black)] md:text-3xl">
            Estamos construindo isso junto com você.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            O produto está em constante evolução. Se existe algo que poderia
            tornar sua experiência melhor, queremos saber.
          </p>
        </div>
      </section>
    </>
  );
}
