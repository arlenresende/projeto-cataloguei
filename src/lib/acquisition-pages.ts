export type AcquisitionFaq = {
  question: string;
  answer: string;
};

export type AcquisitionPageConfig = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  highlights: string[];
  sections: Array<{
    title: string;
    body: string;
  }>;
  steps: string[];
  faqs: AcquisitionFaq[];
  related: Array<{
    href: string;
    label: string;
  }>;
};

export const acquisitionPages = {
  "catalogo-digital": {
    slug: "catalogo-digital",
    title: "Catálogo digital para pequenos negócios",
    description:
      "Entenda como criar um catálogo digital com produtos, categorias, visual personalizado e pedidos enviados pelo WhatsApp.",
    keywords: [
      "catalogo digital",
      "catalogo online",
      "catalogo para pequenos negocios",
      "vitrine digital",
    ],
    eyebrow: "Guia para vender online",
    h1: "Catálogo digital para organizar produtos e vender com um link",
    intro:
      "O Cataloguei ajuda lojas, profissionais e pequenos negócios a transformar produtos soltos em uma vitrine online pronta para compartilhar no WhatsApp, Instagram e atendimento diário.",
    primaryCta: "Criar catálogo grátis",
    secondaryCta: "Ver demonstração",
    highlights: [
      "Produtos com fotos, preços e descrições",
      "Categorias para facilitar a navegação",
      "Personalização visual da loja",
      "Pedido encaminhado pelo WhatsApp",
    ],
    sections: [
      {
        title: "O que é um catálogo digital",
        body:
          "É uma página online onde seus clientes encontram produtos, preços, categorias e informações da loja sem depender de um arquivo PDF ou de mensagens manuais.",
      },
      {
        title: "Para quem o Cataloguei foi feito",
        body:
          "A plataforma atende negócios que vendem por conversa e precisam divulgar um link simples: moda, acessórios, beleza, comida, artesanato, eletrônicos e serviços locais.",
      },
      {
        title: "Como o pedido chega até a loja",
        body:
          "O cliente seleciona produtos no catálogo e o Cataloguei monta uma mensagem organizada para continuar o atendimento diretamente pelo WhatsApp da loja.",
      },
    ],
    steps: [
      "Crie sua conta no Cataloguei.",
      "Cadastre categorias e até 5 produtos no plano grátis.",
      "Personalize cores, logo e informações da loja.",
      "Compartilhe o link do catálogo com seus clientes.",
    ],
    faqs: [
      {
        question: "O Cataloguei substitui meu WhatsApp?",
        answer:
          "Não. O Cataloguei organiza a vitrine e envia o cliente para continuar o pedido no WhatsApp da sua loja.",
      },
      {
        question: "Preciso saber programar para criar meu catálogo?",
        answer:
          "Não. O painel foi pensado para cadastrar produtos, categorias e informações da loja sem mexer em código.",
      },
    ],
    related: [
      { href: "/catalogo-para-whatsapp", label: "Catálogo para WhatsApp" },
      { href: "/catalogo-digital-gratis", label: "Catálogo digital grátis" },
      { href: "/como-criar-catalogo-online", label: "Como criar catálogo online" },
    ],
  },
  "catalogo-para-whatsapp": {
    slug: "catalogo-para-whatsapp",
    title: "Catálogo para WhatsApp com pedidos organizados",
    description:
      "Crie um catálogo para WhatsApp, compartilhe o link da loja e receba mensagens de pedido com produtos selecionados.",
    keywords: [
      "catalogo para whatsapp",
      "pedido pelo whatsapp",
      "vender pelo whatsapp",
      "catalogo online whatsapp",
    ],
    eyebrow: "Venda por conversa",
    h1: "Catálogo para WhatsApp com produtos selecionados pelo cliente",
    intro:
      "Quem vende pelo WhatsApp precisa responder rápido e com clareza. O Cataloguei deixa os produtos navegáveis e prepara a conversa com os itens escolhidos.",
    primaryCta: "Criar catálogo para WhatsApp",
    secondaryCta: "Abrir demonstração",
    highlights: [
      "Link para colocar na bio e nos anúncios",
      "Carrinho convertido em mensagem",
      "Categorias para reduzir dúvidas",
      "Atendimento continua no WhatsApp",
    ],
    sections: [
      {
        title: "Menos mensagens repetidas",
        body:
          "Em vez de enviar foto, preço e disponibilidade item por item, você compartilha o catálogo e deixa o cliente explorar antes de chamar.",
      },
      {
        title: "Pedido mais claro para responder",
        body:
          "Quando o cliente escolhe produtos, a mensagem enviada ao WhatsApp já chega com itens e quantidades, facilitando o fechamento da venda.",
      },
      {
        title: "Um link para diferentes canais",
        body:
          "Use o mesmo catálogo no Instagram, em grupos, campanhas, cartão digital e atendimento recorrente.",
      },
    ],
    steps: [
      "Cadastre o WhatsApp da loja.",
      "Adicione os produtos com foto, preço e descrição.",
      "Divulgue o link do catálogo.",
      "Receba o cliente com o pedido já estruturado.",
    ],
    faqs: [
      {
        question: "O cliente precisa instalar algum aplicativo?",
        answer:
          "Não. Ele acessa o catálogo pelo navegador e segue para o WhatsApp quando quiser enviar o pedido.",
      },
      {
        question: "Posso usar o link na bio do Instagram?",
        answer:
          "Sim. O catálogo foi pensado para ser compartilhado em bio, stories, anúncios e conversas.",
      },
    ],
    related: [
      { href: "/catalogo-digital", label: "Catálogo digital" },
      { href: "/catalogo-online", label: "Landing do Cataloguei" },
      { href: "/catalogo-para-loja-de-roupas", label: "Catálogo para moda" },
    ],
  },
  "catalogo-digital-gratis": {
    slug: "catalogo-digital-gratis",
    title: "Catálogo digital grátis para começar a vender online",
    description:
      "Comece com um catálogo digital grátis no Cataloguei, publique até 5 produtos e compartilhe sua loja online pelo WhatsApp.",
    keywords: [
      "catalogo digital gratis",
      "catalogo online gratis",
      "criar catalogo gratis",
      "loja online gratis",
    ],
    eyebrow: "Comece sem cartão",
    h1: "Catálogo digital grátis para validar sua vitrine online",
    intro:
      "O plano grátis do Cataloguei permite começar pequeno, organizar os primeiros produtos e entender como seus clientes navegam antes de evoluir para mais recursos.",
    primaryCta: "Criar conta grátis",
    secondaryCta: "Conhecer planos",
    highlights: [
      "Até 5 produtos no plano grátis",
      "Link público para divulgar",
      "Categorias e informações da loja",
      "Upgrade quando precisar crescer",
    ],
    sections: [
      {
        title: "Comece pelo essencial",
        body:
          "Cadastre os produtos mais importantes, organize as primeiras categorias e compartilhe um link profissional com seus clientes.",
      },
      {
        title: "Ideal para testar demanda",
        body:
          "O plano grátis ajuda a entender se o catálogo melhora o atendimento antes de cadastrar um sortimento maior.",
      },
      {
        title: "Cresça no Premium",
        body:
          "Quando a loja precisar de mais produtos e recursos, o Premium libera uma operação mais completa dentro do painel.",
      },
    ],
    steps: [
      "Crie sua conta.",
      "Preencha os dados da loja.",
      "Cadastre até 5 produtos.",
      "Compartilhe o link com seus primeiros clientes.",
    ],
    faqs: [
      {
        question: "O plano grátis precisa de cartão?",
        answer:
          "Não. Você pode começar pelo plano grátis e decidir depois se quer evoluir para o Premium.",
      },
      {
        question: "Quantos produtos posso cadastrar no plano grátis?",
        answer: "O plano grátis permite cadastrar até 5 produtos.",
      },
    ],
    related: [
      { href: "/catalogo-digital", label: "Catálogo digital" },
      { href: "/como-criar-catalogo-online", label: "Como criar catálogo online" },
      { href: "/catalogo-para-whatsapp", label: "Catálogo para WhatsApp" },
    ],
  },
  "como-criar-catalogo-online": {
    slug: "como-criar-catalogo-online",
    title: "Como criar catálogo online para sua loja",
    description:
      "Veja o passo a passo para criar um catálogo online, organizar produtos, personalizar sua loja e receber pedidos pelo WhatsApp.",
    keywords: [
      "como criar catalogo online",
      "criar catalogo online",
      "fazer catalogo digital",
      "montar catalogo virtual",
    ],
    eyebrow: "Passo a passo",
    h1: "Como criar catálogo online sem complicar sua operação",
    intro:
      "Um bom catálogo online precisa ser simples de manter, fácil de compartilhar e claro para o cliente comprar. O Cataloguei reúne esses passos em um painel só.",
    primaryCta: "Começar agora",
    secondaryCta: "Ver exemplo pronto",
    highlights: [
      "Escolha produtos estratégicos",
      "Organize por categorias",
      "Use fotos e descrições claras",
      "Divulgue o link nos canais certos",
    ],
    sections: [
      {
        title: "1. Defina o que entra primeiro",
        body:
          "Comece pelos produtos que mais vendem ou que mais geram dúvidas no atendimento. Isso deixa o catálogo útil desde o primeiro dia.",
      },
      {
        title: "2. Estruture categorias simples",
        body:
          "Categorias como novidades, mais vendidos, roupas, acessórios ou kits ajudam o cliente a encontrar o que procura sem perguntar tudo no WhatsApp.",
      },
      {
        title: "3. Transforme visitas em conversas",
        body:
          "Depois de navegar, o cliente envia os itens escolhidos para o WhatsApp e a loja continua a venda com contexto.",
      },
    ],
    steps: [
      "Crie uma conta no Cataloguei.",
      "Cadastre dados, logo e WhatsApp da loja.",
      "Inclua produtos com fotos e preços atualizados.",
      "Publique e acompanhe o comportamento no painel.",
    ],
    faqs: [
      {
        question: "Preciso cadastrar todos os produtos de uma vez?",
        answer:
          "Não. Você pode começar com poucos produtos e ampliar o catálogo conforme entender a demanda dos clientes.",
      },
      {
        question: "O catálogo online funciona em celular?",
        answer:
          "Sim. As páginas públicas são pensadas para navegação pelo celular, onde boa parte das conversas de venda acontece.",
      },
    ],
    related: [
      { href: "/catalogo-digital-gratis", label: "Catálogo digital grátis" },
      { href: "/catalogo-digital", label: "Catálogo digital" },
      { href: "/catalogo-para-whatsapp", label: "Catálogo para WhatsApp" },
    ],
  },
  "catalogo-para-loja-de-roupas": {
    slug: "catalogo-para-loja-de-roupas",
    title: "Catálogo para loja de roupas e acessórios",
    description:
      "Monte um catálogo online para loja de roupas, organize peças por categoria e envie pedidos para o WhatsApp.",
    keywords: [
      "catalogo para loja de roupas",
      "catalogo de moda online",
      "catalogo para boutique",
      "vender roupas pelo whatsapp",
    ],
    eyebrow: "Moda e acessórios",
    h1: "Catálogo para loja de roupas vender melhor pelo WhatsApp",
    intro:
      "Para moda, clareza visual é parte da venda. O Cataloguei ajuda sua loja a apresentar peças, categorias, preços e combinações em uma vitrine simples de compartilhar.",
    primaryCta: "Criar catálogo de moda",
    secondaryCta: "Ver demonstração",
    highlights: [
      "Categorias por coleção, tipo ou ocasião",
      "Fotos grandes para destacar as peças",
      "Pedido com itens escolhidos",
      "Link para bio, stories e atendimento",
    ],
    sections: [
      {
        title: "Organize coleções e novidades",
        body:
          "Separe vestidos, blusas, acessórios, lançamentos ou promoções para reduzir perguntas repetidas e guiar a compra.",
      },
      {
        title: "Ajude o cliente a decidir",
        body:
          "Fotos, descrições e preços visíveis deixam a conversa no WhatsApp mais objetiva e aumentam a chance de o cliente chegar pronto para comprar.",
      },
      {
        title: "Divulgação em qualquer canal",
        body:
          "O link do catálogo pode ser usado na bio, em campanhas, listas de transmissão e conversas individuais.",
      },
    ],
    steps: [
      "Crie as categorias da loja.",
      "Cadastre as peças com fotos e preços.",
      "Personalize a aparência com a identidade da marca.",
      "Envie o link para clientes e seguidores.",
    ],
    faqs: [
      {
        question: "Posso separar produtos por coleção?",
        answer:
          "Sim. Você pode organizar categorias conforme a lógica da sua loja, como coleção, ocasião, tipo de peça ou promoção.",
      },
      {
        question: "Serve para loja pequena?",
        answer:
          "Sim. O Cataloguei foi pensado para pequenos negócios que precisam vender com organização sem montar uma operação complexa de e-commerce.",
      },
    ],
    related: [
      { href: "/catalogo-para-whatsapp", label: "Catálogo para WhatsApp" },
      { href: "/catalogo-digital-gratis", label: "Catálogo grátis" },
      { href: "/catalogo-digital", label: "Catálogo digital" },
    ],
  },
} satisfies Record<string, AcquisitionPageConfig>;

export const acquisitionPageList = Object.values(acquisitionPages);

export function getAcquisitionPage(slug: keyof typeof acquisitionPages) {
  return acquisitionPages[slug];
}
