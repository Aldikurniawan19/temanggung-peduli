"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { TreePine, Menu, X, HandHelping } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site-config";

export function Header() {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState<string>("/");
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine active state for links across all routes
  const isLinkActive = useCallback(
    (linkHref: string) => {
      if (pathname === "/") {
        return activeHref === linkHref;
      }
      if (
        linkHref === "/#donasi" &&
        (pathname === "/donasi" || pathname.startsWith("/donasi/"))
      ) {
        return true;
      }
      if (
        linkHref === "/ucapan" &&
        (pathname === "/ucapan" || pathname.startsWith("/ucapan/"))
      ) {
        return true;
      }
      if (
        linkHref === "/#update" &&
        (pathname === "/dokumentasi" || pathname.startsWith("/dokumentasi/"))
      ) {
        return true;
      }
      if (linkHref === "/" && pathname === "/") {
        return true;
      }
      return pathname === linkHref;
    },
    [pathname, activeHref]
  );

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // ScrollSpy to track sections when on homepage
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    // Check initial hash on mount
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const match = SITE_CONFIG.navLinks.find((l) => l.href === `/${hash}`);
        if (match) {
          setActiveHref(match.href);
          const targetId = hash.replace("#", "");
          const elem = document.getElementById(targetId);
          if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    }

    const sections = [
      { id: "update", href: "/#update" },
      { id: "donasi", href: "/#donasi" },
    ];

    let ticking = false;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isClickScrolling.current) {
            ticking = false;
            return;
          }

          // At top of page (hero / beranda)
          if (window.scrollY < 180) {
            setActiveHref("/");
            ticking = false;
            return;
          }

          let currentHref = "/";

          // Check sections in reverse order (bottom-up: update, then donasi)
          for (const sec of sections) {
            const el = document.getElementById(sec.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              // When section top reaches upper half of viewport
              if (rect.top <= 260) {
                currentHref = sec.href;
                break;
              }
            }
          }

          setActiveHref(currentHref);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleScroll);
    window.addEventListener("popstate", handleScroll);

    // Initial check on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleScroll);
      window.removeEventListener("popstate", handleScroll);
    };
  }, [pathname]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setIsMobileMenuOpen(false);

      if (pathname === "/" && href.startsWith("/#")) {
        e.preventDefault();
        const targetId = href.replace("/#", "");
        const elem = document.getElementById(targetId);
        if (elem) {
          isClickScrolling.current = true;
          setActiveHref(href);
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

          elem.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href.replace("/", ""));

          scrollTimeoutRef.current = setTimeout(() => {
            isClickScrolling.current = false;
          }, 850);
        }
      } else if (pathname === "/" && href === "/") {
        e.preventDefault();
        isClickScrolling.current = true;
        setActiveHref("/");
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", window.location.pathname);

        scrollTimeoutRef.current = setTimeout(() => {
          isClickScrolling.current = false;
        }, 850);
      } else {
        setActiveHref(href);
      }
    },
    [pathname]
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185334] rounded-lg p-1"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#EBF5EF] text-[#185334] transition-transform group-hover:scale-105">
            <TreePine className="w-5 h-5 text-[#185334]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-slate-900 tracking-tight leading-tight">
              Peduli Hutan
            </span>
            <span className="text-[11px] text-slate-500 font-medium leading-none">
              Bersama Lawan Karhutla
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <LayoutGroup id="header-nav">
          <nav className="hidden md:flex items-center gap-7">
            {SITE_CONFIG.navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              const isHovered = hoveredHref === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  className={`relative py-2.5 text-sm transition-colors duration-150 select-none ${
                    isActive
                      ? "text-[#185334] font-bold"
                      : isHovered
                      ? "text-slate-900 font-medium"
                      : "text-slate-600 font-medium"
                  }`}
                >
                  <span>{link.label}</span>

                  {/* Animated Green Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-underline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#185334] rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/donasi">
            <button
              type="button"
              className="rounded-full bg-[#185334] hover:bg-[#124229] text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <HandHelping className="w-4 h-4" />
              <span>Donasi Sekarang</span>
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#185334]"
          aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-5 space-y-1.5 overflow-hidden shadow-lg"
          >
            {SITE_CONFIG.navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#EBF5EF] text-[#185334]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#185334]" />
                  )}
                </Link>
              );
            })}

            <div className="pt-3">
              <Link href="/donasi" onClick={() => setIsMobileMenuOpen(false)}>
                <button
                  type="button"
                  className="w-full rounded-full bg-[#185334] hover:bg-[#124229] text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <HandHelping className="w-4 h-4" />
                  <span>Donasi Sekarang</span>
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
