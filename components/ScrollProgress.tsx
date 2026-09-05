"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Section config — mirrors the 3 hero sections ── */
const SECTIONS = [
  { id: "hero-1", label: "Intro",   color: "#DF301C", bg: "#FFF1D1" },
  { id: "hero-2", label: "Craft",   color: "#FF9100", bg: "#1B1207" },
  { id: "hero-3", label: "Connect", color: "#FFF1D1", bg: "#DF301C" },
];

const TRACK_H = 160; // px — total track height between first and last dot
const DOT_R   = 5;   // dot radius

export default function ScrollProgress() {
  /* refs */
  const wrapRef    = useRef<HTMLDivElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);
  const fillRef    = useRef<SVGPathElement>(null);
  const dotsRef    = useRef<(SVGCircleElement | null)[]>([]);
  const ringsRef   = useRef<(SVGCircleElement | null)[]>([]);
  const labelsRef  = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const path   = pathRef.current;
    const fill   = fillRef.current;
    const wrap   = wrapRef.current;
    if (!path || !fill || !wrap) return;

    /* ── Path length for dash animation ── */
    const pathLen = path.getTotalLength();
    gsap.set(fill, { strokeDasharray: pathLen, strokeDashoffset: pathLen });

    /* ── Entrance: fade the whole bar in ── */
    gsap.fromTo(wrap,
      { opacity: 0, x: 18 },
      { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 1.4 }
    );

    /* ── Main scroll progress tween ── */
    const obj = { progress: 0 };

    ScrollTrigger.create({
      trigger: "main",
      start: "top top",
      end:   "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;

        /* fill line */
        gsap.to(fill, {
          strokeDashoffset: pathLen * (1 - p),
          duration: 0.05,
          ease: "none",
          overwrite: true,
        });

        /* percentage counter */
        const pct = Math.round(p * 100);
        if (percentRef.current) percentRef.current.textContent = `${pct}%`;

        /* section index */
        const secIdx = Math.min(
          SECTIONS.length - 1,
          Math.floor(p * SECTIONS.length)
        );

        if (counterRef.current) {
          counterRef.current.textContent = `0${secIdx + 1}`;
        }

        /* update dot styles */
        SECTIONS.forEach((sec, i) => {
          const dot   = dotsRef.current[i];
          const ring  = ringsRef.current[i];
          const label = labelsRef.current[i];
          if (!dot || !ring || !label) return;

          const isActive = i === secIdx;
          const isPassed = i < secIdx;

          gsap.to(dot, {
            attr: { r: isActive ? 7 : 4.5 },
            fill: isPassed || isActive ? sec.color : "rgba(27,18,7,0.2)",
            duration: 0.35,
            ease: "back.out(2)",
          });

          /* pulsing ring on active */
          gsap.to(ring, {
            attr: { r: isActive ? 14 : 4.5 },
            opacity: isActive ? 0.35 : 0,
            stroke: sec.color,
            duration: 0.4,
            ease: "power2.out",
          });

          /* label slide */
          gsap.to(label, {
            opacity: isActive ? 1 : 0,
            x: isActive ? 0 : 6,
            duration: 0.35,
            ease: "power2.out",
          });
        });

        /* update fill line color — gradient by blending section colors */
        const fillColor = SECTIONS[secIdx].color;
        gsap.to(fill, { stroke: fillColor, duration: 0.5, ease: "power1.out" });

        void obj.progress;
      },
    });

    /* ── Pulse ring animation (infinite) ── */
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      gsap.to(ring, {
        attr: { r: "+=3" },
        opacity: "-=0.08",
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === "main") t.kill();
      });
    };
  }, []);

  /* ── dot Y positions ── */
  const dotYs = SECTIONS.map((_, i) =>
    i * (TRACK_H / (SECTIONS.length - 1))
  );

  /* SVG viewBox dimensions */
  const svgW = 24;
  const svgH = TRACK_H + 20;
  const cx   = svgW / 2;

  /* The path through all dots */
  const pathD = dotYs.map((y, i) => `${i === 0 ? "M" : "L"} ${cx} ${y + 10}`).join(" ");

  return (
    <div
      ref={wrapRef}
      aria-hidden
      style={{ opacity: 0 }}
      className="fixed right-6 top-1/2 z-40 -translate-y-1/2 hidden md:flex flex-col items-center"
    >
      {/* ── Percentage counter ── */}
      <span
        ref={percentRef}
        className="mb-3 font-display text-[10px] font-semibold tabular-nums text-ink/30 tracking-wider"
      >
        0%
      </span>

      {/* ── SVG track ── */}
      <div className="relative" style={{ width: svgW, height: svgH }}>

        {/* Section labels — absolutely positioned to the left of each dot */}
        {SECTIONS.map((sec, i) => (
          <span
            key={sec.id}
            ref={(el) => { labelsRef.current[i] = el; }}
            className="absolute right-full mr-3 whitespace-nowrap font-body text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{
              top: dotYs[i] + 10 - 7,
              color: sec.color,
              opacity: 0,
              transform: "translateX(6px)",
            }}
          >
            {sec.label}
          </span>
        ))}

        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width={svgW}
          height={svgH}
          overflow="visible"
        >
          {/* Track line (background) */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="rgba(27,18,7,0.12)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Fill line (progress) */}
          <path
            ref={fillRef}
            d={pathD}
            fill="none"
            stroke={SECTIONS[0].color}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Dots + rings per section */}
          {SECTIONS.map((sec, i) => (
            <g key={sec.id}>
              {/* Pulse ring */}
              <circle
                ref={(el) => { ringsRef.current[i] = el; }}
                cx={cx}
                cy={dotYs[i] + 10}
                r={4.5}
                fill="none"
                stroke={sec.color}
                strokeWidth="1"
                opacity={0}
              />
              {/* Dot */}
              <circle
                ref={(el) => { dotsRef.current[i] = el; }}
                cx={cx}
                cy={dotYs[i] + 10}
                r={i === 0 ? 7 : 4.5}
                fill={i === 0 ? sec.color : "rgba(27,18,7,0.2)"}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* ── Section counter ── */}
      <span
        ref={counterRef}
        className="mt-3 font-display text-[10px] font-semibold tabular-nums text-ink/30 tracking-wider"
      >
        01
      </span>

      {/* ── Vertical "SCROLL" label ── */}
      <span
        className="mt-4 font-body text-[8px] font-semibold uppercase tracking-[0.35em] text-ink/20"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        Scroll
      </span>
    </div>
  );
}
