"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  ready: boolean;
}

/* ─────────────────────────────────────────────────────
   3 vertical hero sections — each full-viewport height
   Lenis smooth-scrolls them; GSAP ScrollTrigger adds
   per-layer parallax depth on scroll.
───────────────────────────────────────────────────── */

export default function Hero({ ready }: HeroProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  /* Entrance animation for section 1 */
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      /* grid lines scale in from top */
      gsap.fromTo(".hgl",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 1.8, stagger: 0.08, ease: "power3.out", delay: 0.1 }
      );

      /* section-1 content stagger */
      gsap.fromTo(".s1-badge",
        { opacity: 0, y: 14, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.7)", delay: 0.3 }
      );
      gsap.fromTo(".s1-line",
        { yPercent: 110, rotate: 2 },
        { yPercent: 0, rotate: 0, duration: 1.1, ease: "power4.out", stagger: 0.1, delay: 0.45 }
      );
      gsap.fromTo(".s1-sub",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.85 }
      );
      gsap.fromTo(".s1-cta",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.05 }
      );
      gsap.fromTo(".s1-tags",
        { opacity: 0 },
        { opacity: 1, duration: 0.7, delay: 1.25 }
      );

      /* scroll caret bounce */
      gsap.to(".sc-caret", {
        y: 9, duration: 1.0, yoyo: true, repeat: -1, ease: "sine.inOut",
      });

      /* marquee */
      if (marqueeRef.current) {
        const w = marqueeRef.current.scrollWidth / 2;
        gsap.to(marqueeRef.current, { x: -w, duration: 30, repeat: -1, ease: "none" });
      }

      /* orbit ring */
      gsap.to(".orbit-svg", { rotate: 360, duration: 45, repeat: -1, ease: "none", transformOrigin: "center center" });

      /* section 2 — reveal on scroll */
      gsap.fromTo(".s2-badge",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: "#hero-2", start: "top 72%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(".s2-line",
        { yPercent: 110 },
        {
          yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.1,
          scrollTrigger: { trigger: "#hero-2", start: "top 68%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(".s2-body",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: "#hero-2", start: "top 60%", toggleActions: "play none none none" },
        }
      );

      /* section 3 — reveal on scroll */
      gsap.fromTo(".s3-badge",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: "#hero-3", start: "top 72%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(".s3-line",
        { yPercent: 110 },
        {
          yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.1,
          scrollTrigger: { trigger: "#hero-3", start: "top 68%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(".s3-body",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: "#hero-3", start: "top 60%", toggleActions: "play none none none" },
        }
      );

      /* ── Parallax on bg decorative elements ── */
      /* Section 1 — orbit ring drifts up slowly */
      gsap.to(".s1-parallax-bg", {
        y: -120,
        ease: "none",
        scrollTrigger: { trigger: "#hero-1", start: "top top", end: "bottom top", scrub: 1.5 },
      });
      /* Section 1 — headline drifts up slightly faster */
      gsap.to(".s1-parallax-text", {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: "#hero-1", start: "top top", end: "bottom top", scrub: 1.0 },
      });

      /* Section 2 — bg blob drifts */
      gsap.to(".s2-parallax-bg", {
        y: -100,
        ease: "none",
        scrollTrigger: { trigger: "#hero-2", start: "top bottom", end: "bottom top", scrub: 1.5 },
      });
      gsap.to(".s2-parallax-text", {
        y: -50,
        ease: "none",
        scrollTrigger: { trigger: "#hero-2", start: "top bottom", end: "bottom top", scrub: 1.0 },
      });

      /* Section 3 — bg blob drifts */
      gsap.to(".s3-parallax-bg", {
        y: -100,
        ease: "none",
        scrollTrigger: { trigger: "#hero-3", start: "top bottom", end: "bottom top", scrub: 1.5 },
      });
      gsap.to(".s3-parallax-text", {
        y: -50,
        ease: "none",
        scrollTrigger: { trigger: "#hero-3", start: "top bottom", end: "bottom top", scrub: 1.0 },
      });

    });
    return () => ctx.revert();
  }, [ready]);

  /* ── JSX ── */
  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1 — cream / intro
      ══════════════════════════════════════════ */}
      <section
        id="hero-1"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-cream px-8 pt-28 pb-20 md:px-14 lg:px-24"
      >
        {/* Grid lines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex justify-between px-8 md:px-14">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="hgl block h-full w-px bg-ink/[0.05] origin-top" />
          ))}
        </div>

        {/* Parallax BG layer — orbit ring */}
        <div className="s1-parallax-bg pointer-events-none absolute inset-0 z-0">
          <svg
            aria-hidden
            viewBox="0 0 600 600"
            className="orbit-svg absolute -right-40 top-1/2 hidden h-[620px] w-[620px] -translate-y-1/2 lg:block"
          >
            <circle cx="300" cy="300" r="295" stroke="#1B1207" strokeOpacity="0.05" fill="none" strokeDasharray="1 9" />
            <circle cx="300" cy="300" r="215" stroke="#DF301C" strokeOpacity="0.14" fill="none" strokeDasharray="3 14" />
            <circle cx="300" cy="300" r="140" stroke="#1B1207" strokeOpacity="0.05" fill="none" />
            <circle cx="300" cy="5"   r="6"   fill="#DF301C" />
            <circle cx="78"  cy="450" r="4.5" fill="#FF9100" />
            <circle cx="545" cy="415" r="3.5" fill="#00B7CD" />
          </svg>
          {/* Giant bg numeral */}
          <span
            aria-hidden
            className="absolute -right-4 bottom-0 select-none font-display font-bold leading-none text-ink"
            style={{ fontSize: "clamp(14rem,30vw,28rem)", opacity: 0.03 }}
          >
            01
          </span>
        </div>

        {/* Parallax text layer */}
        <div className="s1-parallax-text relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="s1-badge mb-9 inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-ink/[0.04] px-4 py-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
            </span>
            <span className="font-body text-[11px] font-medium text-ink/60">
              Available for projects · 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-8 font-display font-bold leading-[0.92] text-ink"
              style={{ fontSize: "clamp(3rem,7.5vw,7rem)" }}>
            <span className="block overflow-hidden">
              <span className="s1-line block">I build digital</span>
            </span>
            <span className="block overflow-hidden">
              <span className="s1-line block">experiences</span>
            </span>
            <span className="block overflow-hidden">
              <span className="s1-line block relative inline-block">
                <em className="not-italic text-red">that feel alive.</em>
                <svg aria-hidden className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                  <path d="M0,5 Q75,0 150,5 Q225,10 300,5" fill="none" stroke="#DF301C" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </h1>

          {/* Sub */}
          <p className="s1-sub mb-10 max-w-xl font-body text-base leading-relaxed text-ink/60 md:text-[1.06rem]">
            Abuzar Malik — full stack developer crafting interactive,
            high-performance experiences with code, motion, and design.
          </p>

          {/* CTAs */}
          <div className="s1-cta mb-12 flex flex-wrap gap-4">
            <MagBtn href="#work" accent="#DF301C" bg="#FFF1D1" filled>
              View my work →
            </MagBtn>
            <MagBtn href="#about" accent="#1B1207" bg="#FFF1D1">
              About me
            </MagBtn>
          </div>

          {/* Tags */}
          <div className="s1-tags flex flex-wrap gap-2 border-t border-ink/10 pt-6">
            {["Full Stack Developer", "React", "Next.js", "TypeScript", "GSAP"].map((t) => (
              <span key={t} className="rounded-full border border-ink/12 px-3.5 py-1 font-body text-[10px] font-medium uppercase tracking-widest text-ink/40">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll caret */}
        <div className="absolute bottom-10 right-10 hidden flex-col items-center gap-2 md:flex" aria-hidden>
          <span className="font-body text-[9px] uppercase tracking-[0.3em] text-ink/30">Scroll</span>
          <span className="sc-caret font-display text-xl text-red">↓</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — ink / craft
      ══════════════════════════════════════════ */}
      <section
        id="hero-2"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink px-8 pt-28 pb-20 md:px-14 lg:px-24"
      >
        {/* Parallax BG */}
        <div className="s2-parallax-bg pointer-events-none absolute inset-0 z-0">
          {/* Giant numeral */}
          <span
            aria-hidden
            className="absolute -right-4 bottom-0 select-none font-display font-bold leading-none text-orange"
            style={{ fontSize: "clamp(14rem,30vw,28rem)", opacity: 0.05 }}
          >
            02
          </span>
          {/* Diagonal lines */}
          <svg aria-hidden viewBox="0 0 500 800" className="absolute right-0 top-0 h-full w-1/2 opacity-[0.05]">
            {[...Array(12)].map((_, i) => (
              <line key={i} x1={i * 55 - 80} y1="0" x2={i * 55 + 280} y2="800" stroke="#FF9100" strokeWidth="1" />
            ))}
          </svg>
        </div>

        {/* Parallax text */}
        <div className="s2-parallax-text relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="s2-badge mb-9 inline-flex items-center gap-2.5 rounded-full border border-orange/20 bg-orange/[0.06] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            <span className="font-body text-[11px] font-medium text-orange/70">
              What I do
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-8 font-display font-bold leading-[0.92] text-cream"
              style={{ fontSize: "clamp(3rem,7.5vw,7rem)" }}>
            <span className="block overflow-hidden">
              <span className="s2-line block">Code, motion,</span>
            </span>
            <span className="block overflow-hidden">
              <span className="s2-line block">
                and <em className="not-italic text-orange">creativity</em>
              </span>
            </span>
          </h2>

          {/* Sub */}
          <p className="s2-body mb-10 max-w-xl font-body text-base leading-relaxed text-cream/55 md:text-[1.06rem]">
            I build modern interfaces where thoughtful design, clean engineering,
            and smooth interactions come together.
          </p>

          {/* CTA */}
          <div className="s2-body mb-12">
            <MagBtn href="#process" accent="#FF9100" bg="#1B1207">
              See the process →
            </MagBtn>
          </div>

          {/* Tags */}
          <div className="s2-body flex flex-wrap gap-2 border-t border-cream/10 pt-6">
            {["GSAP", "UI/UX", "Interaction", "Motion Design", "Node.js", "Express"].map((t) => (
              <span key={t} className="rounded-full border border-cream/10 px-3.5 py-1 font-body text-[10px] font-medium uppercase tracking-widest text-cream/35">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — red / connect
      ══════════════════════════════════════════ */}
      <section
        id="hero-3"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-red px-8 pt-28 pb-20 md:px-14 lg:px-24"
      >
        {/* Parallax BG */}
        <div className="s3-parallax-bg pointer-events-none absolute inset-0 z-0">
          <span
            aria-hidden
            className="absolute -right-4 bottom-0 select-none font-display font-bold leading-none text-cream"
            style={{ fontSize: "clamp(14rem,30vw,28rem)", opacity: 0.07 }}
          >
            03
          </span>
          {/* Glow blob */}
          <div
            aria-hidden
            className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #FFF1D1 0%, transparent 65%)" }}
          />
        </div>

        {/* Parallax text */}
        <div className="s3-parallax-text relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="s3-badge mb-9 inline-flex items-center gap-2.5 rounded-full border border-cream/25 bg-cream/10 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cream" />
            <span className="font-body text-[11px] font-medium text-cream/70">
              Let&apos;s build something
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-8 font-display font-bold leading-[0.92] text-cream"
              style={{ fontSize: "clamp(3rem,7.5vw,7rem)" }}>
            <span className="block overflow-hidden">
              <span className="s3-line block">Have an idea?</span>
            </span>
            <span className="block overflow-hidden">
              <span className="s3-line block">Let&apos;s make</span>
            </span>
            <span className="block overflow-hidden">
              <span className="s3-line block">it real.</span>
            </span>
          </h2>

          {/* Sub */}
          <p className="s3-body mb-4 max-w-xl font-body text-base leading-relaxed text-cream/65 md:text-[1.06rem]">
            I&apos;m open to freelance, creative, and collaborative projects.
          </p>
          <p className="s3-body mb-10 max-w-xl font-body text-base leading-relaxed text-cream/45">
            Let&apos;s turn your idea into something people remember.
          </p>

          {/* CTA */}
          <div className="s3-body mb-12">
            <MagBtn href="#contact" accent="#FFF1D1" bg="#DF301C" filled>
              Start a project →
            </MagBtn>
          </div>

          {/* Tags */}
          <div className="s3-body flex flex-wrap gap-2 border-t border-cream/20 pt-6">
            {["Freelance", "Collab", "Open to work", "2026"].map((t) => (
              <span key={t} className="rounded-full border border-cream/20 px-3.5 py-1 font-body text-[10px] font-medium uppercase tracking-widest text-cream/50">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MARQUEE strip
      ══════════════════════════════════════════ */}
      <div className="overflow-hidden border-y border-ink/10 bg-cream py-3.5" aria-hidden>
        <div ref={marqueeRef} className="flex whitespace-nowrap">
          {[...Array(4)].flatMap(() =>
            ["Full Stack Developer", "Creative Development", "React", "Next.js",
             "TypeScript", "GSAP", "UI/UX", "Interaction"].map((item, i) => (
              <span key={`${item}-${i}`}
                className="mx-7 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/25">
                {item}<span className="ml-7 text-red">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

    </>
  );
}

/* ─── Magnetic button ───────────────────────────────── */
function MagBtn({
  href, children, accent, bg, filled,
}: {
  href: string;
  children: React.ReactNode;
  accent: string;
  bg: string;
  filled?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.3,
      y: (e.clientY - r.top - r.height / 2) * 0.38,
      duration: 0.45, ease: "power3.out",
    });
  };
  const onLeave = () =>
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1,0.45)" });

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 px-8 py-3.5 font-body text-sm font-semibold"
      style={{
        borderColor: accent,
        color: filled ? bg : accent,
        backgroundColor: filled ? accent : "transparent",
      }}
    >
      {/* Hover fill */}
      <span
        className="absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
        style={{ backgroundColor: filled ? bg : accent }}
      />
      <span
        className="relative z-10 transition-colors duration-300"
        style={{ color: filled ? bg : accent }}
      >
        {children}
      </span>
    </a>
  );
}

