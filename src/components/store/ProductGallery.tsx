"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);
  const hasMultiple = images.length > 1;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden rounded-2xl"
        style={{ border: "1px solid var(--theme-border)" }}
      >
        <Image
          src={images[current]}
          alt={`Imagem principal de ${productName}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {hasMultiple && (
          <>
            <button
              onClick={() =>
                setCurrent((i) => (i - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrent((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative size-16 shrink-0 overflow-hidden rounded-lg transition-opacity md:size-20"
              style={{
                border:
                  i === current
                    ? "2px solid var(--theme-primary)"
                    : "1px solid var(--theme-border)",
                opacity: i === current ? 1 : 0.6,
              }}
            >
              <Image
                src={img}
                alt={`Imagem ${i + 1} de ${productName}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
