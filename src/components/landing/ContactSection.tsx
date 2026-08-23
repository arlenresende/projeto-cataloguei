import { MessageCircle, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUBJECTS = [
  "Tenho uma dúvida",
  "Quero fazer uma sugestão",
  "Encontrei um problema",
  "Quero sugerir uma funcionalidade",
  "Quero conversar sobre outra coisa",
];

export function ContactSection() {
  return (
    <>
      {/* Hero */}
      <section
        id="contato"
        className="bg-white py-20 md:py-28"
        aria-labelledby="contact-title"
      >
        <div className="mx-auto max-w-2xl px-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-indigo-50 p-3 text-indigo-600">
            <MessageCircle className="size-6" />
          </span>
          <h2
            id="contact-title"
            className="mt-6 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl"
          >
            Tem alguma dúvida? Vamos conversar.
          </h2>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Se você não encontrou o que precisava, ficou com alguma dúvida ou
            simplesmente quer compartilhar uma ideia, fale com a gente. Estamos
            aqui para ouvir.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Sua sugestão pode ajudar a melhorar o produto para todo mundo.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h3 className="text-xl font-semibold text-gray-900">
              Envie sua mensagem
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Responderemos o mais rápido possível.
            </p>

            <form className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  placeholder="Como podemos te chamar?"
                  className="mt-1.5 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  placeholder="seu@email.com"
                  className="mt-1.5 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Assunto
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  className="mt-1.5 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="" disabled selected>
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
                  className="block text-sm font-medium text-gray-700"
                >
                  Mensagem
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Conte um pouco mais sobre o que você precisa..."
                  className="mt-1.5 block w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <Button size="lg" className="w-full">
                <Send className="mr-2 size-4" />
                Enviar mensagem
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Final block */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-indigo-50 p-3 text-indigo-600">
            <Heart className="size-6" />
          </span>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Estamos construindo isso junto com você.
          </h2>
          <p className="mt-3 text-base text-gray-600">
            O produto está em constante evolução. Se existe algo que poderia
            tornar sua experiência melhor, queremos saber.
          </p>
        </div>
      </section>
    </>
  );
}
