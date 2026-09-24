"use client";

import { useEffect, useRef, useState } from "react";
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
const REEL_SPEED = 40; // pixels per second
const RESUME_AFTER = 2500; // ms of no interaction before it scrolls on its own again

/**
 * The homepage gallery reel: up to 14 photos (never the two in the hero) in a strip
 * that scrolls on its own and can also be scrolled by hand (swipe, trackpad, mouse
 * wheel, dragging with the mouse, the arrow buttons or the keyboard). The set is drawn
 * twice back to back so it loops seamlessly; the second copy is hidden from screen
 * readers and keyboard users.
 */
export function PhotoReel({ photos }: { photos: Photo[] }) {
  const order = useRandomOrder(photos);
  const scroller = useRef<HTMLDivElement>(null);
  const count = Math.max(0, Math.min(REEL_SIZE, photos.length - 2));

  useEffect(() => {
    const el = scroller.current;
    if (!el || !order) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pos = el.scrollLeft;
    let last = performance.now();
    let pausedUntil = 0;
    let hovering = false;
    let frame = 0;

    const half = () => el.scrollWidth / 2;
    // Keep the position inside the first copy so scrolling never reaches an end.
    const wrap = () => {
      const h = half();
      if (h <= 0) return;
      if (el.scrollLeft >= h) el.scrollLeft -= h;
      else if (el.scrollLeft <= 0) el.scrollLeft += h;
    };
    const pause = () => {
      pausedUntil = performance.now() + RESUME_AFTER;
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      // The visitor scrolled it themselves: carry on from where they left it.
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;
      if (!reduceMotion && !hovering && now > pausedUntil) {
        pos += (REEL_SPEED * dt) / 1000;
        const h = half();
        if (h > 0 && pos >= h) pos -= h;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // Dragging with the mouse (touch screens scroll natively).
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragging = false;
    let moved = false;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = false;
      dragStartX = e.clientX;
      dragStartScroll = el.scrollLeft;
      pause();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 5) {
        moved = true;
        el.classList.add("is-dragging");
      }
      el.scrollLeft = dragStartScroll - dx;
      wrap();
      pause();
    };
    const onPointerUp = () => {
      dragging = false;
      el.classList.remove("is-dragging");
    };
    // A drag shouldn't count as a click on the photo underneath.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const onScroll = () => wrap();
    const onEnter = () => (hovering = true);
    const onLeave = () => {
      hovering = false;
      pause();
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("focusin", pause);
    el.addEventListener("keydown", pause);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("keydown", pause);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [order]);

  // Arrow buttons move by about two photos.
  const nudge = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(".b-reel-item");
    const step = item ? item.offsetWidth * 2 + 28 : 480;
    el.dispatchEvent(new Event("keydown"));
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  if (!order) {
    return (
      <div className="b-reel-wrap">
        <div className="b-reel" aria-hidden="true">
          <div className="b-reel-track">
            {Array.from({ length: Math.min(count, 6) }, (_, i) => (
              <span key={i} className="b-reel-item b-tile" />
            ))}
          </div>
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
      draggable={false}
    >
      <Image src={p.url} alt={copy ? "" : p.alt} fill sizes="(max-width: 520px) 45vw, 240px" draggable={false} />
    </Link>
  );

  return (
    <div className="b-reel-wrap">
      <div ref={scroller} className="b-reel" tabIndex={0} role="region" aria-label="Photos from school life. Scroll sideways to see more.">
        <div className="b-reel-track">
          {reel.map((p) => item(p, false))}
          {reel.map((p) => item(p, true))}
        </div>
      </div>
      <button type="button" className="b-reel-btn prev" aria-label="Previous photos" onClick={() => nudge(-1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>
      <button type="button" className="b-reel-btn next" aria-label="Next photos" onClick={() => nudge(1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
