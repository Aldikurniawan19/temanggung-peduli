"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HeartHandshake,
  MessageSquareCheck,
  Camera,
  TreePine,
  Menu,
  X,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import { SITE_CONFIG } from "@/constants/site-config";

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Ringkasan",
    description: "Statistik & log aktivitas",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/donasi",
    label: "Kelola Donasi",
    description: "Daftar & audit transaksi",
    icon: HeartHandshake,
    exact: false,
  },
  {
    href: "/admin/ucapan",
    label: "Moderasi Doa",
    description: "Persetujuan pesan warga",
    icon: MessageSquareCheck,
    exact: false,
  },
  {
    href: "/admin/dokumentasi",
    label: "Galeri Dokumentasi",
    description: "Upload foto & arsip aksi",
    icon: Camera,
    exact: false,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Jangan tampilkan sidebar & header dashboard pada halaman login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      window.location.href = "/admin/login";
    }
  };

  const isActiveLink = (itemHref: string, exact: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  const getPageTitle = () => {
    if (pathname === "/admin") return "Ringkasan Dashboard";
    if (pathname.startsWith("/admin/donasi")) return "Kelola Donasi & Audit";
    if (pathname.startsWith("/admin/ucapan")) return "Moderasi Doa & Ucapan";
    if (pathname.startsWith("/admin/dokumentasi")) return "Kelola Galeri Dokumentasi";
    return "Panel Admin";
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-slate-50/60 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#EBF5EF] text-[#185334]">
            <TreePine className="w-4 h-4 text-[#185334]" />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-900 block leading-tight">
              Panel Admin
            </span>
            <span className="text-[10px] text-slate-500 font-medium block">
              {SITE_CONFIG.name}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label={isMobileOpen ? "Tutup menu" : "Buka menu"}
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Admin (Desktop Fixed + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 md:z-30 w-72 h-screen bg-white border-r border-slate-200/80 p-5 shrink-0 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo & Header Title */}
          <div className="shrink-0 flex items-center justify-between pb-4 border-b border-slate-100">
            <Link
              href="/admin"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#EBF5EF] text-[#185334] transition-transform group-hover:scale-105">
                <TreePine className="w-5 h-5 text-[#185334]" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block tracking-tight">
                  Admin Peduli Hutan
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Karhutla Kalimantan
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigasi Utama */}
          <div className="flex-1 overflow-y-auto mt-6 pr-1 space-y-1.5">
            <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Utama
            </div>
            <nav className="space-y-1.5">
              {ADMIN_NAV_ITEMS.map((item) => {
                const active = isActiveLink(item.href, item.exact);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-start gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      active
                        ? "bg-[#EBF5EF] text-[#185334] font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        active ? "text-[#185334]" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="leading-tight">{item.label}</span>
                      <span
                        className={`text-[11px] mt-0.5 leading-none font-normal ${
                          active ? "text-[#185334]/80" : "text-slate-400"
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Sidebar: Tautan ke Publik & Keluar */}
        <div className="shrink-0 pt-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:text-[#185334] hover:bg-slate-50 transition-colors border border-slate-200/60"
          >
            <span>Buka Website Publik</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-colors border border-red-100/80 cursor-pointer"
          >
            <span>Keluar Sesi</span>
            <LogOut className="w-4 h-4 text-red-500" />
          </button>

          <div className="text-[10px] text-slate-400 text-center pt-1">
            Temanggung Peduli Kalimantan v1.0
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto">
        {/* Top Header Desktop */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200/80 px-8 py-4 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-medium">Panel Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">{getPageTitle()}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-[1440px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
