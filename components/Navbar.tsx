"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<(HTMLLIElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
        .fromTo(
          linksRef.current.filter(Boolean),
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.07 },
          "-=0.4"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.3"
        );
    });
    return () => ctx.revert();
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu toggle
  useEffect(() => {
    if (!menuRef.current) return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(menuRef.current, { display: "flex" });
      gsap.fromTo(
        menuRef.current,
        { clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" },
        {
          clipPath: "circle(170% at calc(100% - 2.5rem) 2.5rem)",
          duration: 0.7,
          ease: "power4.inOut",
        }
      );
      gsap.fromTo(
        menuItemsRef.current.filter(Boolean),
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.07,
          delay: 0.25,
          ease: "power3.out",
        }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(menuRef.current, {
        clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)",
        duration: 0.55,
        ease: "power4.inOut",
        onComplete: () => {
          if (menuRef.current) gsap.set(menuRef.current, { display: "none" });
        },
      });
    }
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/80 backdrop-blur-lg shadow-sm shadow-ink/5"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          {/* Logo */}
          <a
            ref={logoRef}
            href="#top"
            style={{ opacity: 0 }}
            className="group flex items-center gap-3"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink overflow-hidden">
              <span className="font-display text-sm font-bold text-cream relative z-10">
                AM
              </span>
              <span className="absolute inset-0 bg-red scale-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-100" />
              <span className="font-display text-sm font-bold text-cream absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                AM
              </span>
            </span>
            <span className="font-display text-base font-semibold text-ink tracking-tight">
              Abuzar Malik
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.href}
                ref={(el) => { linksRef.current[i] = el; }}
                style={{ opacity: 0 }}
              >
                <NavLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            ref={ctaRef}
            href="#contact"
            style={{ opacity: 0 }}
            className="group relative hidden overflow-hidden rounded-full border border-ink/25 px-5 py-2.5 font-body text-sm font-medium text-ink md:inline-flex items-center gap-1.5"
          >
            <span className="absolute inset-0 bg-ink transition-transform duration-300 ease-out origin-left scale-x-0 group-hover:scale-x-100" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-cream">
              Let&apos;s talk
            </span>
            <span className="relative z-10 inline-block transition-all duration-300 group-hover:text-cream group-hover:translate-x-0.5">
              →
            </span>
          </a>

          {/* Mobile toggle */}
          <HamburgerButton
            open={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          />
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        style={{ display: "none" }}
        className="fixed inset-0 z-50 hidden flex-col justify-center bg-ink px-10 md:hidden"
      >
        {/* Decorative number */}
        <span className="absolute right-8 top-1/2 -translate-y-1/2 font-display text-[18vw] font-bold text-cream/5 select-none">
          AM
        </span>

        <ul className="flex flex-col gap-1 relative z-10">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              <a
                ref={(el) => { menuItemsRef.current[i] = el; }}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-baseline gap-3 py-3 font-display text-5xl font-semibold text-cream/80 transition-colors duration-200 hover:text-cream"
              >
                <span className="font-body text-xs text-cream/30 tabular-nums">
                  0{i + 1}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center gap-4 relative z-10">
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="rounded-full border border-cream/20 px-5 py-2.5 font-body text-sm text-cream/70 hover:text-cream hover:border-cream/40 transition-colors duration-200"
          >
            Let&apos;s talk →
          </a>
        </div>
      </div>
    </>
  );
}

/* ── Nav link with animated underline ── */
function NavLink({ href, label }: { href: string; label: string }) {
  const underlineRef = useRef<HTMLSpanElement>(null);

  function onEnter() {
    gsap.fromTo(
      underlineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.35, ease: "power3.out" }
    );
  }
  function onLeave() {
    gsap.to(underlineRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.3,
      ease: "power3.in",
    });
  }

  return (
    <a
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative py-1 font-body text-sm font-medium text-ink/70 hover:text-ink transition-colors duration-200"
    >
      {label}
      <span
        ref={underlineRef}
        className="absolute -bottom-0.5 left-0 h-px w-full bg-red scale-x-0"
      />
    </a>
  );
}

/* ── Hamburger ── */
function HamburgerButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  const topRef = useRef<HTMLSpanElement>(null);
  const midRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (open) {
      gsap.to(topRef.current, { rotate: 45, y: 6, duration: 0.3, ease: "power2.inOut" });
      gsap.to(midRef.current, { opacity: 0, scaleX: 0, duration: 0.2 });
      gsap.to(botRef.current, { rotate: -45, y: -6, duration: 0.3, ease: "power2.inOut" });
    } else {
      gsap.to(topRef.current, { rotate: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
      gsap.to(midRef.current, { opacity: 1, scaleX: 1, duration: 0.3 });
      gsap.to(botRef.current, { rotate: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
    }
  }, [open]);

  return (
    <button
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
      className="relative z-[60] flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
    >
      <span ref={topRef} className="h-[1.5px] w-5 bg-ink block" />
      <span ref={midRef} className="h-[1.5px] w-5 bg-ink block" />
      <span ref={botRef} className="h-[1.5px] w-5 bg-ink block" />
    </button>
  );
}
