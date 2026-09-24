"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Photo } from "@/lib/gallery";

// One random order per page visit, shared by the hero and the gallery strip so they
// never show the same photo. The page is pre-built, so the server sends the newest
// photos first and the browser shuffles them straight after loading.
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

function useRandomOrder(photos: Photo[]) {
  const [order, setOrder] = useState(photos);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOrder(shuffle(photos)));
    return () => cancelAnimationFrame(id);
  }, [photos]);
  return order;
}

/** The two small photos beside the logo in the hero. */
export function HeroPhotos({ photos }: { photos: Photo[] }) {
  const order = useRandomOrder(photos);
  return (
    <>
      {[0, 1].map((i) => (
        <div key={i} className={`b-collage-sm${order[i] ? "" : " b-tile"}`}>
          {order[i] && (
            <Image src={order[i].url} alt={order[i].alt} fill sizes="(max-width: 860px) 40vw, 240px" priority={i === 0} />
          )}
        </div>
      ))}
    </>
  );
}

/** Up to five photos in the "Life at Laurels" strip, avoiding the two in the hero when possible. */
export function PhotoStrip({ photos }: { photos: Photo[] }) {
  const order = useRandomOrder(photos);
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
