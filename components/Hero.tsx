"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  ready: boolean;
}

export default function Hero({ ready }: HeroProps) {
  const marqueeRef  = useRef<HTMLDivElement>(null);
  const imgCardRef  = useRef<HTMLDivElement>(null);
  const imgWrapRef  = useRef<HTMLDivElement>(null);
  const shadowRef   = useRef<HTMLDivElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);

  /* ── 3D mouse-tilt (section 1 only) ── */
  useEffect(() => {
    const card    = imgCardRef.current;
    const shadow  = shadowRef.current;
    const glow    = glowRef.current;
    const section = document.getElementById("hero-1");
    if (!card || !section) return;

    function onMove(e: MouseEvent) {
      const rect = card!.getBoundingClientRect();
      const dx   = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
      const dy   = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);

      gsap.to(card, {
        rotateX:  dy * -14,
        rotateY:  dx *  16,
        transformPerspective: 900,
        duration: 0.55,
        ease: "power2.out",
      });

      if (shadow) gsap.to(shadow, { x: dx * 20, y: dy * 14, duration: 0.55, ease: "power2.out" });

      if (glow) {
        gsap.to(glow, {
          x: e.clientX - rect.left - 120,
          y: e.clientY - rect.top  - 120,
          opacity: 0.55,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }

    function onLeave() {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.4)",
      });
      if (shadow) gsap.to(shadow, { x: 0, y: 0, duration: 0.7, ease: "power2.out" });
      if (glow)   gsap.to(glow,   { opacity: 0, duration: 0.5 });
    }

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, [ready]);

  /* ── All entrance + scroll animations ── */
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {

      /* grid lines */
      gsap.fromTo(".hgl",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 1.8, stagger: 0.08, ease: "power3.out", delay: 0.1 }
      );

      /* s1 text */
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

      /* image card slides in */
      gsap.fromTo(imgWrapRef.current,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 1.3, ease: "power4.out", delay: 0.55 }
      );

      /* floating badges */
      gsap.fromTo(".float-badge",
        { opacity: 0, scale: 0.7, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.8)", stagger: 0.15, delay: 1.15 }
      );
      gsap.to(".fba", { y: -8, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".fbb", { y:  6, duration: 1.9, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.6 });
      gsap.to(".fbc", { y: -5, duration: 2.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.1 });

      /* scroll caret */
      gsap.to(".sc-caret", { y: 9, duration: 1.0, yoyo: true, repeat: -1, ease: "sine.inOut" });

      /* marquee */
      if (marqueeRef.current) {
        const w = marqueeRef.current.scrollWidth / 2;
        gsap.to(marqueeRef.current, { x: -w, duration: 30, repeat: -1, ease: "none" });
      }

      /* orbit */
      gsap.to(".orbit-svg", {
        rotate: 360, duration: 45, repeat: -1, ease: "none", transformOrigin: "center center",
      });

      /* image parallax on scroll — image rises slower */
      gsap.to(imgWrapRef.current, {
        y: -90, ease: "none",
        scrollTrigger: { trigger: "#hero-1", start: "top top", end: "bottom top", scrub: 1.8 },
      });

      /* s1 parallax */
      gsap.to(".s1-parallax-bg",   { y: -130, ease: "none", scrollTrigger: { trigger: "#hero-1", start: "top top", end: "bottom top", scrub: 1.5 } });
      gsap.to(".s1-parallax-text", { y: -60,  ease: "none", scrollTrigger: { trigger: "#hero-1", start: "top top", end: "bottom top", scrub: 1.0 } });

      /* s2 reveals */
      gsap.fromTo(".s2-badge", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: "#hero-2", start: "top 72%", toggleActions: "play none none none" } });
      gsap.fromTo(".s2-line",  { yPercent: 110 },      { yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.1, scrollTrigger: { trigger: "#hero-2", start: "top 68%", toggleActions: "play none none none" } });
      gsap.fromTo(".s2-body",  { opacity: 0, y: 24 },  { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: "#hero-2", start: "top 60%", toggleActions: "play none none none" } });
      gsap.to(".s2-parallax-bg",   { y: -100, ease: "none", scrollTrigger: { trigger: "#hero-2", start: "top bottom", end: "bottom top", scrub: 1.5 } });
      gsap.to(".s2-parallax-text", { y: -50,  ease: "none", scrollTrigger: { trigger: "#hero-2", start: "top bottom", end: "bottom top", scrub: 1.0 } });

      /* s3 reveals */
      gsap.fromTo(".s3-badge", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: "#hero-3", start: "top 72%", toggleActions: "play none none none" } });
      gsap.fromTo(".s3-line",  { yPercent: 110 },      { yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.1, scrollTrigger: { trigger: "#hero-3", start: "top 68%", toggleActions: "play none none none" } });
      gsap.fromTo(".s3-body",  { opacity: 0, y: 24 },  { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: "#hero-3", start: "top 60%", toggleActions: "play none none none" } });
      gsap.to(".s3-parallax-bg",   { y: -100, ease: "none", scrollTrigger: { trigger: "#hero-3", start: "top bottom", end: "bottom top", scrub: 1.5 } });
      gsap.to(".s3-parallax-text", { y: -50,  ease: "none", scrollTrigger: { trigger: "#hero-3", start: "top bottom", end: "bottom top", scrub: 1.0 } });

    });
    return () => ctx.revert();
  }, [ready]);

  return (
    <>
      {/* ══════════════════════════════════════
          SECTION 1 — cream / intro + 3D image
      ══════════════════════════════════════ */}
      <section
        id="hero-1"
        className="relative flex min-h-screen items-center overflow-hidden bg-cream px-8 pt-28 pb-20 md:px-14 lg:px-20"
      >
        {/* Grid lines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex justify-between px-8 md:px-14">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="hgl block h-full w-px bg-ink/[0.05] origin-top" />
          ))}
        </div>

        {/* BG parallax */}
        <div className="s1-parallax-bg pointer-events-none absolute inset-0 z-0">
          <svg aria-hidden viewBox="0 0 600 600"
            className="orbit-svg absolute -right-40 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 opacity-30 lg:block">
            <circle cx="300" cy="300" r="295" stroke="#1B1207" strokeOpacity="0.05" fill="none" strokeDasharray="1 9" />
            <circle cx="300" cy="300" r="215" stroke="#DF301C" strokeOpacity="0.12" fill="none" strokeDasharray="3 14" />
            <circle cx="300" cy="300" r="140" stroke="#1B1207" strokeOpacity="0.05" fill="none" />
            <circle cx="300" cy="5"   r="6"   fill="#DF301C" />
            <circle cx="78"  cy="450" r="4.5" fill="#FF9100" />
            <circle cx="545" cy="415" r="3.5" fill="#00B7CD" />
          </svg>
          <span aria-hidden
            className="absolute -right-4 bottom-0 select-none font-display font-bold leading-none text-ink"
            style={{ fontSize: "clamp(14rem,28vw,26rem)", opacity: 0.025 }}>
            01
          </span>
        </div>

        {/* Two-column grid */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-8">

          {/* LEFT — text */}
          <div className="s1-parallax-text">
            <div className="s1-badge mb-9 inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-ink/[0.04] px-4 py-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
              </span>
              <span className="font-body text-[11px] font-medium text-ink/60">
                Available for projects · 2026
              </span>
            </div>

            <h1 className="mb-8 font-display font-bold leading-[0.92] text-ink"
                style={{ fontSize: "clamp(2.8rem,6.2vw,6.5rem)" }}>
              <span className="block overflow-hidden">
                <span className="s1-line block">I build digital</span>
              </span>
              <span className="block overflow-hidden">
                <span className="s1-line block">experiences</span>
              </span>
              <span className="block overflow-hidden">
                <span className="s1-line block relative">
                  <em className="not-italic text-red">that feel alive.</em>
                  <svg aria-hidden className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                    <path d="M0,5 Q75,0 150,5 Q225,10 300,5" fill="none" stroke="#DF301C" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="s1-sub mb-10 max-w-lg font-body text-base leading-relaxed text-ink/60 md:text-[1.05rem]">
              Abuzar Malik — full stack developer crafting interactive,
              high-performance experiences with code, motion, and design.
            </p>

            <div className="s1-cta mb-12 flex flex-wrap gap-4">
              <MagBtn href="#work"  accent="#DF301C" bg="#FFF1D1" filled>View my work →</MagBtn>
              <MagBtn href="#about" accent="#1B1207" bg="#FFF1D1">About me</MagBtn>
            </div>

            <div className="s1-tags flex flex-wrap gap-2 border-t border-ink/10 pt-6">
              {["Full Stack", "React", "Next.js", "TypeScript", "GSAP"].map((t) => (
                <span key={t}
                  className="rounded-full border border-ink/12 px-3.5 py-1 font-body text-[10px] font-medium uppercase tracking-widest text-ink/40">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — 3D image */}
          <div
            ref={imgWrapRef}
            style={{ opacity: 0, perspective: "900px" }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Floating badge A — top left */}
            <div className="float-badge fba absolute -left-4 top-6 z-20 flex items-center gap-2 rounded-2xl border border-ink/10 bg-cream px-3.5 py-2.5 shadow-xl shadow-ink/10">
              <span className="text-base">⚡</span>
              <div>
                <p className="font-display text-[11px] font-bold leading-none text-ink">Fast &amp; Modern</p>
                <p className="mt-0.5 font-body text-[9px] text-ink/40">Web Experiences</p>
              </div>
            </div>

            {/* Floating badge B — bottom left */}
            <div className="float-badge fbb absolute -left-2 bottom-10 z-20 flex items-center gap-2 rounded-2xl border border-ink/10 bg-ink px-3.5 py-2.5 shadow-lg">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
              </span>
              <p className="font-body text-[11px] font-medium text-cream/80">Open to work</p>
            </div>

            {/* Floating badge C — top right */}
            <div className="float-badge fbc absolute -right-2 top-14 z-20 rounded-2xl border border-red/20 bg-red/10 px-3.5 py-2.5 shadow-md">
              <p className="font-display text-[11px] font-bold leading-none text-red">3+ Years</p>
              <p className="mt-0.5 font-body text-[9px] text-ink/45">Experience</p>
            </div>

            {/* 3D card */}
            <div
              ref={imgCardRef}
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
              className="relative"
            >
              {/* Drop shadow */}
              <div
                ref={shadowRef}
                aria-hidden
                className="absolute -bottom-6 left-1/2 z-[-1] h-20 w-4/5 -translate-x-1/2 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, rgba(27,18,7,0.4) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              {/* Card */}
              <div
                className="relative overflow-hidden rounded-3xl border border-white/10"
                style={{ background: "linear-gradient(145deg,#1a1009 0%,#2e1d0c 100%)" }}
              >
                {/* Cursor glow */}
                <div
                  ref={glowRef}
                  aria-hidden
                  className="pointer-events-none absolute z-[2] h-60 w-60 rounded-full opacity-0"
                  style={{ background: "radial-gradient(circle, rgba(223,48,28,0.45) 0%, transparent 70%)" }}
                />

                {/* Glass shine */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[3] rounded-3xl"
                  style={{ background: "linear-gradient(135deg,rgba(255,241,209,0.08) 0%,transparent 55%,rgba(255,241,209,0.03) 100%)" }}
                />

                {/* Image */}
                <Image
                  src="/abuzar.png"
                  alt="Abuzar Malik — Full Stack Developer"
                  width={420}
                  height={520}
                  priority
                  className="relative z-[1] block"
                  style={{
                    width: "clamp(280px, 32vw, 420px)",
                    height: "auto",
                    display: "block",
                  }}
                />

                {/* Bottom fade */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-0 right-0 z-[4] h-28"
                  style={{ background: "linear-gradient(to top,#1a1009 0%,transparent 100%)" }}
                />

                {/* Name tag */}
                <div className="absolute bottom-4 left-4 right-4 z-[5] flex items-end justify-between">
                  <div>
                    <p className="font-display text-sm font-bold leading-tight text-cream">Abuzar Malik</p>
                    <p className="font-body text-[10px] uppercase tracking-widest text-cream/40">Full Stack Dev</p>
                  </div>
                  <div className="flex gap-1">
                    {["TS", "JS", "RN"].map((tag) => (
                      <span key={tag}
                        className="rounded-md bg-cream/10 px-1.5 py-0.5 font-body text-[9px] font-semibold text-cream/55">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll caret */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden flex-col items-center gap-2 md:flex" aria-hidden>
          <span className="font-body text-[9px] uppercase tracking-[0.3em] text-ink/30">Scroll</span>
          <span className="sc-caret font-display text-xl text-red">↓</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — ink / craft
      ══════════════════════════════════════ */}
      <section
        id="hero-2"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink px-8 pt-28 pb-20 md:px-14 lg:px-24"
      >
        <div className="s2-parallax-bg pointer-events-none absolute inset-0 z-0">
          <span aria-hidden
            className="absolute -right-4 bottom-0 select-none font-display font-bold leading-none text-orange"
            style={{ fontSize: "clamp(14rem,30vw,28rem)", opacity: 0.05 }}>
            02
          </span>
          <svg aria-hidden viewBox="0 0 500 800" className="absolute right-0 top-0 h-full w-1/2 opacity-[0.05]">
            {[...Array(12)].map((_, i) => (
              <line key={i} x1={i * 55 - 80} y1="0" x2={i * 55 + 280} y2="800" stroke="#FF9100" strokeWidth="1" />
            ))}
          </svg>
        </div>

        <div className="s2-parallax-text relative z-10 max-w-3xl">
          <div className="s2-badge mb-9 inline-flex items-center gap-2.5 rounded-full border border-orange/20 bg-orange/[0.06] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            <span className="font-body text-[11px] font-medium text-orange/70">What I do</span>
          </div>

          <h2 className="mb-8 font-display font-bold leading-[0.92] text-cream"
              style={{ fontSize: "clamp(3rem,7.5vw,7rem)" }}>
            <span className="block overflow-hidden"><span className="s2-line block">Code, motion,</span></span>
            <span className="block overflow-hidden">
              <span className="s2-line block">and <em className="not-italic text-orange">creativity</em></span>
            </span>
          </h2>

          <p className="s2-body mb-10 max-w-xl font-body text-base leading-relaxed text-cream/55 md:text-[1.06rem]">
            I build modern interfaces where thoughtful design, clean engineering,
            and smooth interactions come together.
          </p>

          <div className="s2-body mb-12">
            <MagBtn href="#process" accent="#FF9100" bg="#1B1207">See the process →</MagBtn>
          </div>

          <div className="s2-body flex flex-wrap gap-2 border-t border-cream/10 pt-6">
            {["GSAP", "UI/UX", "Interaction", "Motion Design", "Node.js", "Express"].map((t) => (
              <span key={t}
                className="rounded-full border border-cream/10 px-3.5 py-1 font-body text-[10px] font-medium uppercase tracking-widest text-cream/35">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — red / connect
      ══════════════════════════════════════ */}
      <section
        id="hero-3"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-red px-8 pt-28 pb-20 md:px-14 lg:px-24"
      >
        <div className="s3-parallax-bg pointer-events-none absolute inset-0 z-0">
          <span aria-hidden
            className="absolute -right-4 bottom-0 select-none font-display font-bold leading-none text-cream"
            style={{ fontSize: "clamp(14rem,30vw,28rem)", opacity: 0.07 }}>
            03
          </span>
          <div aria-hidden
            className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle,#FFF1D1 0%,transparent 65%)" }}
          />
        </div>

        <div className="s3-parallax-text relative z-10 max-w-3xl">
          <div className="s3-badge mb-9 inline-flex items-center gap-2.5 rounded-full border border-cream/25 bg-cream/10 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cream" />
            <span className="font-body text-[11px] font-medium text-cream/70">Let&apos;s build something</span>
          </div>

          <h2 className="mb-8 font-display font-bold leading-[0.92] text-cream"
              style={{ fontSize: "clamp(3rem,7.5vw,7rem)" }}>
            <span className="block overflow-hidden"><span className="s3-line block">Have an idea?</span></span>
            <span className="block overflow-hidden"><span className="s3-line block">Let&apos;s make</span></span>
            <span className="block overflow-hidden"><span className="s3-line block">it real.</span></span>
          </h2>

          <p className="s3-body mb-4 max-w-xl font-body text-base leading-relaxed text-cream/65 md:text-[1.06rem]">
            I&apos;m open to freelance, creative, and collaborative projects.
          </p>
          <p className="s3-body mb-10 max-w-xl font-body text-base leading-relaxed text-cream/45">
            Let&apos;s turn your idea into something people remember.
          </p>

          <div className="s3-body mb-12">
            <MagBtn href="#contact" accent="#FFF1D1" bg="#DF301C" filled>Start a project →</MagBtn>
          </div>

          <div className="s3-body flex flex-wrap gap-2 border-t border-cream/20 pt-6">
            {["Freelance", "Collab", "Open to work", "2026"].map((t) => (
              <span key={t}
                className="rounded-full border border-cream/20 px-3.5 py-1 font-body text-[10px] font-medium uppercase tracking-widest text-cream/50">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <div className="overflow-hidden border-y border-ink/10 bg-cream py-3.5" aria-hidden>
        <div ref={marqueeRef} className="flex whitespace-nowrap">
          {[...Array(4)].flatMap(() =>
            ["Full Stack Developer","Creative Development","React","Next.js",
             "TypeScript","GSAP","UI/UX","Interaction"].map((item, i) => (
              <span key={`${item}-${i}`}
                className="mx-7 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/25">
                {item}<span className="ml-7 text-red">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <AboutSection />
    </>
  );
}

/* ─── Magnetic button ─────────────────────────────── */
function MagBtn({
  href, children, accent, bg, filled,
}: {
  href: string; children: React.ReactNode;
  accent: string; bg: string; filled?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width  / 2) * 0.3,
      y: (e.clientY - r.top  - r.height / 2) * 0.38,
      duration: 0.45, ease: "power3.out",
    });
  };
  const onLeave = () =>
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1,0.45)" });

  return (
    <a ref={ref} href={href} onMouseMove={onMove} onMouseLeave={onLeave}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 px-8 py-3.5 font-body text-sm font-semibold"
      style={{ borderColor: accent, color: filled ? bg : accent, backgroundColor: filled ? accent : "transparent" }}
    >
      <span className="absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
        style={{ backgroundColor: filled ? bg : accent }} />
      <span className="relative z-10" style={{ color: filled ? bg : accent }}>{children}</span>
    </a>
  );
}

/* ─── About section ───────────────────────────────── */
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".al", { yPercent: 105 },
        { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.09,
          scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".at", { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07,
          scrollTrigger: { trigger: ref.current, start: "top 65%", toggleActions: "play none none none" } }
      );
      gsap.to(".about-wm", { y: -80, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1.4 } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} id="about"
      className="relative overflow-hidden bg-ink px-8 py-32 md:px-14 lg:px-24">
      <span aria-hidden
        className="about-wm pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-display font-bold leading-none text-cream/[0.025]"
        style={{ fontSize: "clamp(10rem,22vw,20rem)" }}>
        AM
      </span>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-14 flex items-center gap-4">
          <span className="h-px w-10 bg-cream/20" />
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/30">About me</span>
        </div>

        <div className="mb-14">
          <p className="mb-1 overflow-hidden">
            <span className="al block font-display font-semibold uppercase tracking-[0.2em] text-orange"
              style={{ fontSize: "clamp(0.95rem,1.6vw,1.2rem)" }}>
              Hi, I&apos;m Abuzar Malik.
            </span>
          </p>
          <p className="overflow-hidden">
            <span className="al block font-display font-bold leading-[0.88] text-cream"
              style={{ fontSize: "clamp(3.2rem,8.5vw,8rem)" }}>FULL STACK</span>
          </p>
          <p className="overflow-hidden">
            <span className="al block font-display font-bold leading-[0.88] text-cream"
              style={{ fontSize: "clamp(3.2rem,8.5vw,8rem)" }}>DEVELOPER</span>
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-28">
          <div>
            <p className="at mb-6 font-body text-base leading-relaxed text-cream/55 md:text-lg">
              I build modern, interactive, and high-performance web experiences
              that turn ideas into digital products.
            </p>
            <p className="at mb-10 font-body text-base leading-relaxed text-cream/35">
              React · Next.js · JavaScript · Node · Express
            </p>
            <p className="at mb-10 font-body text-[1.05rem] font-medium text-cream/50">
              Let&apos;s build something meaningful.
            </p>
            <div className="flex flex-wrap gap-2">
              {["React","Next.js","JavaScript","Node","Express"].map((s) => (
                <span key={s}
                  className="at rounded-full border border-cream/10 px-4 py-1.5 font-body text-[11px] font-medium uppercase tracking-widest text-cream/35">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { num: "3+",  label: "Years experience" },
              { num: "20+", label: "Projects shipped"  },
              { num: "10+", label: "Happy clients"     },
              { num: "∞",   label: "Lines of code"     },
            ].map((stat) => (
              <div key={stat.num}
                className="at rounded-2xl border border-cream/8 bg-cream/[0.04] p-6 transition-colors duration-300 hover:bg-cream/[0.07]">
                <p className="font-display font-bold leading-none text-cream"
                  style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>{stat.num}</p>
                <p className="mt-2 font-body text-[11px] uppercase tracking-widest text-cream/30">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
