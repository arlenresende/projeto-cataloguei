import { buildJsonLdScriptContent } from "@/lib/seo";

interface StructuredDataProps {
  data: unknown;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: buildJsonLdScriptContent(data),
      }}
    />
  );
}
