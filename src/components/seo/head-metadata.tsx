"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

type HeadMetadataTag =
  | {
      property: string;
      content: string;
      name?: never;
    }
  | {
      name: string;
      content: string;
      property?: never;
    };

interface HeadMetadataProps {
  tags: HeadMetadataTag[];
}

export function HeadMetadata({ tags }: HeadMetadataProps) {
  const insertedRef = useRef(false);

  useServerInsertedHTML(() => {
    if (insertedRef.current) {
      return null;
    }

    insertedRef.current = true;

    return (
      <>
        {tags.map((tag) => {
          if ("property" in tag) {
            return (
              <meta
                key={`${tag.property}:${tag.content}`}
                property={tag.property}
                content={tag.content}
              />
            );
          }

          return (
            <meta
              key={`${tag.name}:${tag.content}`}
              name={tag.name}
              content={tag.content}
            />
          );
        })}
      </>
    );
  });

  return null;
}
