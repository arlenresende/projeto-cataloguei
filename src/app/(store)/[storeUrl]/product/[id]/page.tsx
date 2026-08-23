import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/mock-data";

interface ProductPageProps {
  params: Promise<{ storeUrl: string; id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { storeUrl, id } = await params;
  const result = getProductById(storeUrl, id);

  if (!result) {
    notFound();
  }

  const { store, product } = result;

  const whatsappLink = (() => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no produto: ${product.name}`
    );
    return `https://wa.me/${store.whatsapp}?text=${message}`;
  })();

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href={`/${storeUrl}`}
          className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="size-4" />
          Voltar para {store.name}
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-xl overflow-hidden border">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <span className="text-sm font-medium opacity-60">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>
            <p className="text-lg opacity-70 mb-6">{product.description}</p>
            <div className="text-3xl font-bold mb-8">
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <Button size="lg">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <MessageCircle className="size-5 mr-2" />
                Contato via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
