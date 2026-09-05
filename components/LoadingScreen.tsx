"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const barTrackRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const counterObj = { value: 0 };

    gsap.set([leftPanelRef.current, rightPanelRef.current], { xPercent: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Exit: split panels slide apart
        const exitTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = "";
            onComplete();
          },
        });

        exitTl
          .to([counterRef.current, labelRef.current, barTrackRef.current], {
            opacity: 0,
            y: -20,
            stagger: 0.05,
            duration: 0.4,
            ease: "power3.in",
          })
          .to(
            leftPanelRef.current,
            { xPercent: -100, duration: 1, ease: "power4.inOut" },
            "-=0.1"
          )
          .to(
            rightPanelRef.current,
            { xPercent: 100, duration: 1, ease: "power4.inOut" },
            "<"
          );
      },
    });

    tl.to(counterObj, {
      value: 100,
      duration: 2.4,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counterObj.value)),
    }).to(
      barRef.current,
      { scaleX: 1, duration: 2.4, ease: "power2.inOut" },
      "<"
    );

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayCount = count.toString().padStart(3, "0");

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex"
      aria-hidden
    >
      {/* Left panel */}
      <div
        ref={leftPanelRef}
        className="relative flex w-1/2 items-end justify-end bg-ink pb-16 pr-10"
      >
        {/* Big counter digits — left half */}
        <span
          ref={counterRef}
          className="select-none font-display text-[clamp(5rem,14vw,11rem)] font-semibold leading-none tabular-nums text-cream/10"
        >
          {displayCount.slice(0, 2)}
        </span>
      </div>

      {/* Right panel */}
      <div
        ref={rightPanelRef}
        className="relative flex w-1/2 flex-col items-start justify-end bg-ink pb-16 pl-10"
      >
        {/* Last digit */}
        <span className="select-none font-display text-[clamp(5rem,14vw,11rem)] font-semibold leading-none tabular-nums text-cream/10">
          {displayCount.slice(2)}
        </span>
      </div>

      {/* Centered overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 pointer-events-none">
        {/* Big visible counter */}
        <span
          className="font-display text-[clamp(4rem,12vw,9rem)] font-bold leading-none tabular-nums text-cream"
          aria-live="polite"
        >
          {displayCount}
        </span>

        {/* Progress bar */}
        <div
          ref={barTrackRef}
          className="h-px w-[min(55vw,360px)] overflow-hidden bg-cream/20"
        >
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0"
            style={{ background: "#DF301C" }}
          />
        </div>

        {/* Label */}
        <p
          ref={labelRef}
          className="font-body text-[11px] uppercase tracking-[0.3em] text-cream/40"
        >
          Loading portfolio
        </p>
      </div>
    </div>
  );
}
