"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Photo } from "@/lib/gallery";

// One random order per page load, shared by every component below, so photos placed
// at different offsets never repeat on the same page. The server sends a random
// selection; the browser shuffles it again straight after loading. Until then the
// boxes show the patterned placeholder, so photos never visibly swap.
let seed: number | null = null;

function shuffle<T>(items: T[]): T[] {
  seed ??= Math.floor(Math.random() * 2 ** 32);
  let s = seed;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function useRandomOrder(photos: Photo[]): Photo[] | null {
  const [order, setOrder] = useState<Photo[] | null>(null);
  useEffect(() => {
    // A timer (not requestAnimationFrame) so it also runs in tabs opened in the background.
    const id = setTimeout(() => setOrder(shuffle(photos)), 0);
    return () => clearTimeout(id);
  }, [photos]);
  return order;
}

/**
 * `count` photo boxes taking photos `offset`, `offset + 1`, … of the shuffled order.
 * A box without a photo shows the warm patterned tile instead.
 */
export function PhotoSlots({
  photos,
  offset = 0,
  count = 1,
  className,
  sizes,
  priority = false,
}: {
  photos: Photo[];
  offset?: number;
  count?: number;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  const order = useRandomOrder(photos);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const p = order && order.length > 0 ? order[(offset + i) % order.length] : undefined;
        return (
          <div key={i} className={`${className}${p ? "" : " b-tile"}`}>
            {p && <Image src={p.url} alt={p.alt} fill sizes={sizes} priority={priority && i === 0} />}
          </div>
        );
      })}
    </>
  );
}

/** Up to five linked photos for the homepage strip, after the two used in the hero. */
export function PhotoStrip({ photos }: { photos: Photo[] }) {
  const order = useRandomOrder(photos);
  const count = Math.min(5, photos.length);
  if (!order) {
    return (
      <div className="b-strip" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="b-tile" />
        ))}
      </div>
    );
  }
  const strip = order.length >= 7 ? order.slice(2, 7) : order.slice(0, 5);
  return (
    <div className="b-strip">
      {strip.map((p) => (
        <Link key={p.id} href={p.albumId ? `/gallery/${p.albumId}` : "/gallery"}>
          <Image src={p.url} alt={p.alt} fill sizes="(max-width: 520px) 50vw, (max-width: 860px) 33vw, 230px" />
        </Link>
      ))}
    </div>
  );
}
