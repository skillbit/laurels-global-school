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

// Burst shots (taken seconds apart) sit next to each other in an album and look the
// same, so photos within this many places of an already-picked one in the same album
// are moved to the end, used only if there aren't enough other photos.
const NEAR = 3;

function spreadOut(order: Photo[]): Photo[] {
  const picked: Photo[] = [];
  const later: Photo[] = [];
  for (const p of order) {
    const tooClose = picked.some((q) => q.albumId === p.albumId && Math.abs(q.pos - p.pos) <= NEAR);
    (tooClose ? later : picked).push(p);
  }
  return [...picked, ...later];
}

function useRandomOrder(photos: Photo[]): Photo[] | null {
  const [order, setOrder] = useState<Photo[] | null>(null);
  useEffect(() => {
    // A timer (not requestAnimationFrame) so it also runs in tabs opened in the background.
    const id = setTimeout(() => setOrder(spreadOut(shuffle(photos))), 0);
    return () => clearTimeout(id);
  }, [photos]);
  return order;
}

/**
 * `count` photo boxes taking photos `offset`, `offset + 1`, … of the shuffled order.
 * Each photo is used once per page; a box without a photo shows the patterned tile.
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
        const p = order?.[offset + i];
        return (
          <div key={i} className={`${className}${p ? "" : " b-tile"}`}>
            {p && <Image src={p.url} alt={p.alt} fill sizes={sizes} priority={priority && i === 0} />}
          </div>
        );
      })}
    </>
  );
}

const REEL_SIZE = 14;

/**
 * The homepage gallery reel: up to 14 photos (never the two in the hero) scrolling
 * sideways in a loop. The set is drawn twice back to back so the loop is seamless;
 * the second copy is hidden from screen readers and keyboard users.
 */
export function PhotoReel({ photos }: { photos: Photo[] }) {
  const order = useRandomOrder(photos);
  const count = Math.max(0, Math.min(REEL_SIZE, photos.length - 2));
  if (!order) {
    return (
      <div className="b-reel" aria-hidden="true">
        <div className="b-reel-track b-reel-still">
          {Array.from({ length: Math.min(count, 6) }, (_, i) => (
            <span key={i} className="b-reel-item b-tile" />
          ))}
        </div>
      </div>
    );
  }
  const reel = order.slice(2, 2 + REEL_SIZE);
  const item = (p: Photo, copy: boolean) => (
    <Link
      key={`${copy ? "b" : "a"}-${p.id}`}
      className="b-reel-item"
      href={p.albumId ? `/gallery/${p.albumId}` : "/gallery"}
      tabIndex={copy ? -1 : undefined}
      aria-hidden={copy || undefined}
    >
      <Image src={p.url} alt={copy ? "" : p.alt} fill sizes="(max-width: 520px) 45vw, 240px" />
    </Link>
  );
  return (
    <div className="b-reel">
      {/* About 4 seconds per photo, so the speed is the same however many there are. */}
      <div className="b-reel-track" style={{ animationDuration: `${reel.length * 4}s` }}>
        {reel.map((p) => item(p, false))}
        {reel.map((p) => item(p, true))}
      </div>
    </div>
  );
}
