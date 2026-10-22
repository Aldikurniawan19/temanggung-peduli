import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  HeartHandshake,
  MessageSquareCheck,
  Camera,
  ExternalLink,
  TreePine,
  Flame,
} from "lucide-react";
import { SITE_CONFIG } from "@/constants/site-config";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-white border-r border-[var(--color-border)] p-4 sm:p-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Brand Logo Admin */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <TreePine className="w-4 h-4 text-[var(--color-primary)]" />
              <Flame className="w-3 h-3 text-[var(--color-accent)] -ml-1 -mt-2" />
            </div>
            <div>
              <span className="font-bold text-sm text-[var(--color-foreground)] block">
                Panel Admin
              </span>
              <span className="text-[10px] text-[var(--color-secondary)] block">
                {SITE_CONFIG.name}
              </span>
            </div>
          </div>

          {/* Navigasi Admin */}
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-secondary-light)] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Dashboard Ringkasan</span>
            </Link>

            <Link
              href="/admin/donasi"
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-secondary-light)] transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Kelola Donasi</span>
            </Link>

            <Link
              href="/admin/ucapan"
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-secondary-light)] transition-colors"
            >
              <MessageSquareCheck className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Moderasi Doa</span>
            </Link>

            <Link
              href="/admin/dokumentasi"
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-secondary-light)] transition-colors"
            >
              <Camera className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Kelola Dokumentasi</span>
            </Link>
          </nav>
        </div>

        {/* Tautan Kembali ke Publik */}
        <div className="pt-6 border-t border-[var(--color-border)] mt-6">
          <Link
            href="/"
            className="flex items-center justify-between text-xs font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          >
            <span>Lihat Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
