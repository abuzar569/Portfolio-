"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────
   PHOTOGRAPHY — pinned horizontal contact sheet.
   Vertical scroll drives a horizontal filmstrip.
   Each frame sits desaturated until it crosses the
   viewport centre, where it resolves to full colour —
   like a print coming up in a darkroom tray.

   Drop your photos into /public/images/photography/
   named image1.jpeg … image16.jpeg
   (recommended: ~1600px long edge, consistent grade).
   Missing files fall back to a numbered placeholder
   tile automatically (see `placeholder` below), so the
   section still renders cleanly before you've added
   real photos.
───────────────────────────────────────────────────── */

type Frame = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  place: string;
  size: "tall" | "wide" | "square" | "feature";
};

const FRAMES: Frame[] = [
  { id: "01", src: "/images/photography/image1.jpeg",  alt: "Portrait lit by a low window",     caption: "Window light",         place: "Aligarh",    size: "tall"    },
  { id: "02", src: "/images/photography/image2.jpeg",  alt: "Street scene at dusk",              caption: "Blue hour",            place: "Delhi",      size: "wide"    },
  { id: "03", src: "/images/photography/image3.jpeg",  alt: "Close-up texture detail",            caption: "Texture study",        place: "Studio",     size: "square"  },
  { id: "04", src: "/images/photography/image4.jpeg",  alt: "Wide open landscape",                caption: "Open road",            place: "Highway 91", size: "feature" },
  { id: "05", src: "/images/photography/image5.jpeg",  alt: "Candid unposed portrait",            caption: "Unposed",              place: "Aligarh",    size: "tall"    },
  { id: "06", src: "/images/photography/image6.jpeg",  alt: "Architectural line and shadow",      caption: "Line & shadow",        place: "Old city",   size: "square"  },
  { id: "07", src: "/images/photography/image7.jpeg",  alt: "Busy morning market",                caption: "Morning market",       place: "Chowk",      size: "wide"    },
  { id: "08", src: "/images/photography/image8.jpeg",  alt: "City skyline after dark",            caption: "After hours",          place: "Delhi",      size: "tall"    },
  { id: "09", src: "/images/photography/image9.jpeg",  alt: "Rain on a windshield",                caption: "Passing storm",        place: "GT Road",    size: "square"  },
  { id: "10", src: "/images/photography/image10.jpeg", alt: "Quiet alley in afternoon light",     caption: "Backstreet",           place: "Old city",   size: "tall"    },
  { id: "11", src: "/images/photography/image11.jpeg", alt: "Portrait against a plain backdrop", caption: "Studio light",         place: "Studio",     size: "wide"    },
  { id: "12", src: "/images/photography/image12.jpeg", alt: "Crowd at a local festival",          caption: "Festival crowd",       place: "Aligarh",    size: "feature" },
  { id: "13", src: "/images/photography/image13.jpeg", alt: "Empty road at sunrise",              caption: "First light",          place: "Highway 91", size: "tall"    },
  { id: "14", src: "/images/photography/image14.jpeg", alt: "Hands at work, close crop",          caption: "Hands at work",        place: "Workshop",   size: "square"  },
  { id: "15", src: "/images/photography/image15.jpeg", alt: "Reflections in a shop window",       caption: "Reflections",          place: "Chowk",      size: "wide"    },
  { id: "16", src: "/images/photography/image16.jpeg", alt: "Rooftop view at golden hour",        caption: "Rooftop, golden hour", place: "Delhi",      size: "tall"    },
];

const SIZE_CLASSES: Record<Frame["size"], string> = {
  tall:    "w-[62vw] md:w-[30vw] lg:w-[21vw]  aspect-[2/3]",
  wide:    "w-[74vw] md:w-[42vw] lg:w-[30vw]  aspect-[3/2]",
  square:  "w-[58vw] md:w-[28vw] lg:w-[19vw]  aspect-square",
  feature: "w-[86vw] md:w-[64vw] lg:w-[46vw]  aspect-[16/10]",
};

/* Placeholder SVG data-URI shown when a jpg isn't found yet */
const placeholder = (id: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%231b1207'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='72' fill='%23fff1d1' opacity='0.12'%3E${id}%3C/text%3E%3C/svg%3E`;

export default function Photography() {
  const sectionRef     = useRef<HTMLElement>(null);
  const headingWrapRef = useRef<HTMLDivElement>(null);
  const pinRef         = useRef<HTMLDivElement>(null);
  const trackRef       = useRef<HTMLDivElement>(null);
  const counterRef     = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const pin   = pinRef.current;
    if (!track || !pin) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {

      /* ── Heading reveal ── */
      gsap.fromTo(".ph-eyebrow",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: headingWrapRef.current, start: "top 78%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".ph-line",
        { yPercent: 105 },
        { yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.08,
          scrollTrigger: { trigger: headingWrapRef.current, start: "top 72%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".ph-sub",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headingWrapRef.current, start: "top 64%", toggleActions: "play none none none" } }
      );

      /* Static fallback for reduced-motion */
      if (reduceMotion) {
        gsap.set(".ph-frame-img", { filter: "none", opacity: 1, scale: 1 });
        gsap.set(".ph-frame-caption", { opacity: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      /* ── Desktop / tablet: pinned horizontal scrub ── */
      mm.add("(min-width: 768px)", () => {
        const distance = () => track.scrollWidth - pin.offsetWidth;

        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                FRAMES.length - 1,
                Math.floor(self.progress * FRAMES.length)
              );
              if (counterRef.current) counterRef.current.textContent = FRAMES[idx].id;
            },
          },
        });

        /* per-frame darkroom reveal */
        const frames = gsap.utils.toArray<HTMLElement>(".ph-frame");
        frames.forEach((frame) => {
          const img = frame.querySelector(".ph-frame-img");
          const cap = frame.querySelector(".ph-frame-caption");

          gsap.fromTo(img,
            { filter: "grayscale(1) contrast(0.85) brightness(0.88)", scale: 1.06 },
            {
              filter: "grayscale(0) contrast(1) brightness(1)", scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                containerAnimation: scrollTween,
                start: "left 82%",
                end:   "left 42%",
                scrub: true,
              },
            }
          );

          gsap.fromTo(cap,
            { opacity: 0, y: 10 },
            {
              opacity: 1, y: 0, ease: "none",
              scrollTrigger: {
                trigger: frame,
                containerAnimation: scrollTween,
                start: "left 75%",
                end:   "left 50%",
                scrub: true,
              },
            }
          );
        });

        return () => scrollTween.kill();
      });

      /* ── Mobile: vertical reveal, native horizontal swipe ── */
      mm.add("(max-width: 767px)", () => {
        const frames = gsap.utils.toArray<HTMLElement>(".ph-frame");
        frames.forEach((frame) => {
          const img = frame.querySelector(".ph-frame-img");
          const cap = frame.querySelector(".ph-frame-caption");

          gsap.fromTo(img,
            { filter: "grayscale(1) contrast(0.85)", scale: 1.04 },
            { filter: "grayscale(0) contrast(1)", scale: 1, duration: 0.9, ease: "power2.out",
              scrollTrigger: { trigger: frame, start: "top 88%" } }
          );
          gsap.fromTo(cap,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.15,
              scrollTrigger: { trigger: frame, start: "top 88%" } }
          );
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Sprocket hole count */
  const sprockets = [...Array(48)];

  return (
    <section
      ref={sectionRef}
      id="photography"
      className="relative overflow-hidden bg-cream"
    >
      {/* ── Section heading ── */}
      <div
        ref={headingWrapRef}
        className="px-8 pb-16 pt-28 md:px-14 lg:px-24"
      >
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-10 bg-ink/20" />
          <span className="ph-eyebrow font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-ink/35">
            Behind the lens
          </span>
        </div>

        <h2
          className="mb-6 font-display font-bold leading-[0.92] text-ink"
          style={{ fontSize: "clamp(2.6rem,6vw,5.5rem)" }}
        >
          <span className="block overflow-hidden">
            <span className="ph-line block">Photography,</span>
          </span>
          <span className="block overflow-hidden">
            <span className="ph-line block">on the side.</span>
          </span>
        </h2>

        <p className="ph-sub max-w-lg font-body text-base leading-relaxed text-ink/55 md:text-[1.05rem]">
          A running contact sheet — scroll to move through the roll, frame by
          frame.
        </p>
      </div>

      {/* ── Pinned filmstrip ── */}
      <div
        ref={pinRef}
        className="relative h-[68vh] w-full overflow-hidden md:h-screen"
      >
        {/* Sprocket holes — top */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-5 z-20 flex justify-between px-4"
        >
          {sprockets.map((_, i) => (
            <span
              key={i}
              className="h-2 w-3 shrink-0 rounded-[2px] bg-ink/12"
            />
          ))}
        </div>

        {/* Sprocket holes — bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-0 right-0 z-20 flex justify-between px-4"
        >
          {sprockets.map((_, i) => (
            <span
              key={i}
              className="h-2 w-3 shrink-0 rounded-[2px] bg-ink/12"
            />
          ))}
        </div>

        {/* ── Horizontal track ── */}
        <div
          ref={trackRef}
          className="flex h-full items-center gap-6 overflow-x-auto px-8 py-16
                     [-ms-overflow-style:none] [scrollbar-width:none]
                     md:gap-10 md:overflow-visible md:px-14 lg:px-24
                     [&::-webkit-scrollbar]:hidden"
        >
          {FRAMES.map((frame) => (
            <figure
              key={frame.id}
              className={`ph-frame relative shrink-0 ${SIZE_CLASSES[frame.size]}`}
            >
              {/* Frame border */}
              <div className="relative h-full w-full overflow-hidden border border-ink/12 bg-ink/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.src}
                  alt={frame.alt}
                  className="ph-frame-img h-full w-full select-none object-cover"
                  draggable={false}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = placeholder(frame.id);
                  }}
                />

                {/* Film grain overlay */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundSize: "128px",
                  }}
                />

                {/* Frame-number stamp top-left */}
                <span
                  aria-hidden
                  className="absolute left-2 top-2 z-10 font-body text-[9px] font-semibold tracking-widest text-cream/40"
                >
                  ▲ {frame.id}
                </span>
              </div>

              {/* Caption */}
              <figcaption className="ph-frame-caption mt-3 flex items-baseline justify-between font-body text-[11px] uppercase tracking-widest text-ink/40">
                <span>
                  {frame.id} — {frame.caption}
                </span>
                <span className="text-ink/25">{frame.place}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Live frame counter */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-12 left-8 z-20 hidden items-baseline gap-1.5 font-display text-sm text-ink/40 md:left-14 md:flex lg:left-24"
        >
          <span ref={counterRef} className="font-semibold tabular-nums text-ink/65">
            01
          </span>
          <span>/ {FRAMES.length.toString().padStart(2, "0")}</span>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="flex justify-center px-8 py-16 md:px-14 lg:px-24">
        <a
          href="/photography"
          className="group inline-flex items-center gap-2 border-b border-ink/25 pb-1 font-body text-sm font-medium text-ink/65 transition-colors duration-300 hover:border-red hover:text-red"
        >
          View the full roll
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </section>
  );
}