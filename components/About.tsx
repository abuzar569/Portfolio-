"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────
   ABOUT — sticky bio + scroll-scrubbed word reveal
   Left column stays put (sticky) while the right column
   scrolls past it. The lead line lights up word by word
   as it crosses the viewport, then supporting content
   (values, stack) follows with ordinary reveals. A
   hand-drawn signature line draws itself in once, and a
   giant "</>" watermark drifts slowly behind everything.
───────────────────────────────────────────────────── */

const LEAD =
  "I'm a full-stack developer who turns ideas into modern, purposeful digital experiences — where technology, design, and interaction meet.";

const VALUES = [
  { label: "Fast",         detail: "Performance isn't an afterthought — it's part of the design." },
  { label: "Responsive",   detail: "Every layout adapts, from a phone in one hand to a wide desktop." },
  { label: "Accessible",   detail: "Built to work for people using a keyboard, a screen reader, or a mouse." },
  { label: "Maintainable", detail: "Clean architecture so the next change doesn't mean starting over." },
  { label: "Enjoyable",    detail: "Smooth animations and small details that make using it feel good." },
];

const STACK = [
  { label: "JavaScript" },
  { label: "React" },
  { label: "Next.js" },
  { label: "PHP" },
  { label: "Python" },
  { label: "Tailwind CSS" },
  { label: "GSAP" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leadRef    = useRef<HTMLParagraphElement>(null);
  const sigPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {

      /* ── Eyebrow + heading ── */
      gsap.fromTo(".abd-eyebrow",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".abd-heading-line",
        { yPercent: 105 },
        { yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 74%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".abd-role",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" } }
      );

      /* ── Signature — draws itself once on first approach ── */
      const sigPath = sigPathRef.current;
      if (sigPath) {
        const len = sigPath.getTotalLength();
        gsap.set(sigPath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(sigPath, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
          scrollTrigger: { trigger: sigPath, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      if (reduceMotion) {
        gsap.set(".abd-word",   { opacity: 1, filter: "none" });
        gsap.set(".abd-reveal", { opacity: 1, y: 0 });
        return;
      }

      /* ── Lead paragraph — words light up as you scroll past ── */
      gsap.set(".abd-word", { opacity: 0.16, filter: "blur(5px)" });
      const words = gsap.utils.toArray<HTMLElement>(".abd-word");
      gsap.timeline({
        scrollTrigger: {
          trigger: leadRef.current,
          start: "top 78%",
          end:   "bottom 40%",
          scrub: 0.6,
        },
      }).to(words, { opacity: 1, filter: "blur(0px)", stagger: 0.6, ease: "none" }, 0);

      /* ── Supporting content — staggered reveals ── */
      gsap.utils.toArray<HTMLElement>(".abd-reveal-group").forEach((group) => {
        const items = group.querySelectorAll(".abd-reveal");
        gsap.fromTo(items,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 82%", toggleActions: "play none none none" } }
        );
      });

      /* ── Watermark parallax ── */
      gsap.to(".abd-watermark", {
        y: -70, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.4 },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-ink px-8 py-28 md:px-14 lg:px-24"
    >
      {/* Watermark */}
      <span
        aria-hidden
        className="abd-watermark pointer-events-none absolute -right-4 top-10 select-none font-display font-bold leading-none text-cream/[0.03]"
        style={{ fontSize: "clamp(9rem,20vw,18rem)" }}
      >
        {"</>"}
      </span>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">

        {/* ── Sticky left column ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-cream/20" />
            <span className="abd-eyebrow font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/35">
              About me
            </span>
          </div>

          <h2
            className="mb-6 font-display font-bold leading-[0.94] text-cream"
            style={{ fontSize: "clamp(2.6rem,5.6vw,4.6rem)" }}
          >
            <span className="block overflow-hidden">
              <span className="abd-heading-line block">Abuzar</span>
            </span>
            <span className="block overflow-hidden">
              <span className="abd-heading-line block">Malik</span>
            </span>
          </h2>

          <p className="abd-role mb-8 font-body text-[1.05rem] font-medium text-orange">
            Full Stack Developer
          </p>

          {/* Hand-drawn signature */}
          <svg aria-hidden viewBox="0 0 220 50" className="h-auto w-40 opacity-90">
            <path
              ref={sigPathRef}
              d="M4,38 C34,8 52,44 78,20 C96,4 108,34 132,22 C152,12 166,32 188,18 C198,12 206,20 214,14"
              fill="none"
              stroke="#DF301C"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ── Scrolling right column ── */}
        <div>

          {/* Lead — scroll-scrubbed word reveal */}
          <p
            ref={leadRef}
            className="mb-14 max-w-2xl font-display font-medium leading-[1.25] text-cream"
            style={{ fontSize: "clamp(1.5rem,3vw,2.3rem)" }}
          >
            {LEAD.split(" ").map((w, i) => (
              <span key={i} className="abd-word mr-[0.28em] inline-block">
                {w}
              </span>
            ))}
          </p>

          {/* Supporting narrative */}
          <div className="abd-reveal-group mb-16 max-w-2xl space-y-5">
            <p className="abd-reveal font-body text-base leading-relaxed text-cream/55 md:text-[1.05rem]">
              I like taking an idea all the way from concept to completion —
              understanding the problem, designing an interface that feels obvious
              to use, building the functionality behind it, then refining the
              details until it feels finished rather than just done.
            </p>
            <p className="abd-reveal font-body text-base leading-relaxed text-cream/55 md:text-[1.05rem]">
              Good development, to me, isn&apos;t just about making something
              work. It&apos;s about the details that quietly make the biggest
              difference — smooth micro-interactions, clean architecture, and a
              layout that holds up on any screen.
            </p>
            <p className="abd-reveal font-body text-base leading-relaxed text-cream/55 md:text-[1.05rem]">
              Outside the code itself, I enjoy the problem-solving — trying new
              tools, picking apart an idea that pushes me technically, and
              finishing a project knowing I actually pushed my own skills forward.
            </p>
          </div>

          {/* Values — hover-interactive list */}
          <div className="abd-reveal-group mb-16">
            <p className="abd-reveal mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-cream/30">
              What I build for
            </p>
            <ul className="abd-reveal divide-y divide-cream/10 border-y border-cream/10">
              {VALUES.map((v) => (
                <li key={v.label} className="group relative overflow-hidden">
                  {/* hover fill */}
                  <div className="absolute inset-0 origin-left scale-x-0 bg-cream/[0.05] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <div className="relative flex flex-col gap-1 px-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="font-display text-lg font-semibold text-cream transition-colors duration-300 group-hover:text-orange sm:w-40 sm:shrink-0">
                      {v.label}
                    </span>
                    <span className="font-body text-sm leading-relaxed text-cream/45 transition-colors duration-300 group-hover:text-cream/70">
                      {v.detail}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack — hover chips */}
          <div className="abd-reveal-group mb-16">
            <p className="abd-reveal mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-cream/30">
              Tools I reach for
            </p>
            <div className="abd-reveal flex flex-wrap gap-2.5">
              {STACK.map((s) => (
                <span
                  key={s.label}
                  className="cursor-default rounded-full border border-cream/15 px-4 py-2 font-body text-[13px] font-medium text-cream/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-ink"
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Closing quote */}
          <div className="abd-reveal-group">
            <p className="abd-reveal max-w-xl border-l-2 border-red pl-6 font-display text-xl font-medium leading-snug text-cream/85 md:text-2xl">
              Build things that look great, work exceptionally well, and leave a
              lasting impression.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
