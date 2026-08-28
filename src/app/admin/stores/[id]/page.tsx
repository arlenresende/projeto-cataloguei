"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Edit, ExternalLink, Store, MapPin, Phone, Globe } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  email: string | null;
  logo: string | null;
  websiteUrl: string | null;
  whatsappUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  phoneNumber: string | null;
  cellPhone: string | null;
  themeStore: string;
  isActive: boolean;
  createdAt: string;
}

export default function ViewStorePage() {
  const params = useParams();
  const id = params.id as string;
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/stores/${id}`);
        const data = await res.json();
        setStore(data.store || null);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--brand-yellow)] border-t-transparent" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-[var(--brand-black)]">
          Loja não encontrada
        </p>
      </div>
    );
  }

  const hasAddress = store.address || store.city || store.state;
  const hasContact = store.email || store.phoneNumber || store.cellPhone || store.whatsappUrl;
  const hasSocial = store.websiteUrl || store.instagramUrl || store.facebookUrl;

  return (
    <div>
      <PageHeader
        title={store.name}
        subtitle={`cataloguei.com.br/${store.slug}`}
        action={
          <div className="flex gap-2">
            <Link
              href={`/${store.slug}`}
              target="_blank"
              className="flex items-center gap-2 rounded-xl border border-[var(--brand-border)] px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)]"
            >
              <ExternalLink size={16} />
              Visualizar
            </Link>
            <Link
              href={`/admin/stores/${store.id}/edit`}
              className="flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
            >
              <Edit size={16} />
              Editar
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Info */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Store size={18} className="text-[var(--brand-black)]/50" />
            <h3 className="text-sm font-bold text-[var(--brand-black)]">Informações da loja</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Nome</p>
              <p className="text-sm font-medium text-[var(--brand-black)]">{store.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Slug</p>
              <p className="text-sm font-medium text-[var(--brand-black)]">{store.slug}</p>
            </div>
            {store.description && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Descrição</p>
                <p className="text-sm font-medium text-[var(--brand-black)]">{store.description}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge variant={store.isActive ? "success" : "neutral"}>
                {store.isActive ? "Ativa" : "Inativa"}
              </Badge>
              <Badge variant="neutral">{store.themeStore}</Badge>
            </div>
          </div>
        </Card>

        {/* Address */}
        {hasAddress && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-[var(--brand-black)]/50" />
              <h3 className="text-sm font-bold text-[var(--brand-black)]">Endereço</h3>
            </div>
            <div className="space-y-3">
              {store.address && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Endereço</p>
                  <p className="text-sm font-medium text-[var(--brand-black)]">{store.address}</p>
                </div>
              )}
              {store.city && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Cidade</p>
                  <p className="text-sm font-medium text-[var(--brand-black)]">{store.city}{store.state ? ` - ${store.state}` : ""}</p>
                </div>
              )}
              {store.postalCode && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">CEP</p>
                  <p className="text-sm font-medium text-[var(--brand-black)]">{store.postalCode}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Contact */}
        {hasContact && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Phone size={18} className="text-[var(--brand-black)]/50" />
              <h3 className="text-sm font-bold text-[var(--brand-black)]">Contato</h3>
            </div>
            <div className="space-y-3">
              {store.email && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Email</p>
                  <p className="text-sm font-medium text-[var(--brand-black)]">{store.email}</p>
                </div>
              )}
              {store.phoneNumber && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Telefone</p>
                  <p className="text-sm font-medium text-[var(--brand-black)]">{store.phoneNumber}</p>
                </div>
              )}
              {store.cellPhone && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Celular</p>
                  <p className="text-sm font-medium text-[var(--brand-black)]">{store.cellPhone}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Social */}
        {hasSocial && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-[var(--brand-black)]/50" />
              <h3 className="text-sm font-bold text-[var(--brand-black)]">Redes sociais</h3>
            </div>
            <div className="space-y-3">
              {store.websiteUrl && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Website</p>
                  <p className="text-sm font-medium text-[var(--brand-black)]">{store.websiteUrl}</p>
                </div>
              )}
              {store.instagramUrl && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Instagram</p>
                  <p className="text-sm font-medium text-[var(--brand-black)]">{store.instagramUrl}</p>
                </div>
              )}
              {store.facebookUrl && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-black)]/40">Facebook</p>
                  <p className="text-sm font-medium text-[var(--brand-black)]">{store.facebookUrl}</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
