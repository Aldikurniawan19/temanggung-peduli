import React from "react";
import Link from "next/link";
import { TreePine, Flame, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { MotionFadeIn } from "@/components/ui/Motion";
import { SITE_CONFIG } from "@/constants/site-config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-footer-bg)] border-t border-[var(--color-footer-border)] mt-20">
      <MotionFadeIn direction="up" delay={0.05} className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Kolom 1: Brand & Misi */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[var(--color-footer-border)] text-[var(--color-primary)] shadow-xs">
                <TreePine className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <span className="font-bold text-lg text-[var(--color-foreground)]">
                {SITE_CONFIG.name}
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed max-w-md">
              {SITE_CONFIG.description}
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-[var(--color-primary)] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Penyaluran dana diaudit dan terdokumentasi terbuka</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[var(--color-foreground)] uppercase tracking-wider">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 text-sm">
              {SITE_CONFIG.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-700 hover:text-[var(--color-primary)] font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak & Posko */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[var(--color-foreground)] uppercase tracking-wider">
              Posko & Kontak
            </h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                <span>{SITE_CONFIG.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Baris Bawah */}
        <div className="mt-12 pt-6 border-t border-[var(--color-footer-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {currentYear} {SITE_CONFIG.name}. Inisiatif masyarakat tanggap bencana.</p>
          <div className="flex items-center gap-4">
            <Link href="/donasi" className="hover:text-[var(--color-primary)]">
              Formulir Donasi
            </Link>
            <span>•</span>
            <Link href="/dokumentasi" className="hover:text-[var(--color-primary)]">
              Laporan Penyaluran
            </Link>
          </div>
        </div>
      </MotionFadeIn>
    </footer>
  );
}
