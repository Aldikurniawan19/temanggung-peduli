"use client";

import React, { useState } from "react";
import { Building2, Copy, Check, PhoneCall, AlertCircle } from "lucide-react";

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  badge?: string;
}

const BANK_ACCOUNTS: BankAccount[] = [
  {
    bankName: "Bank Jateng (BPD)",
    accountNumber: "2-019-28192-1",
    accountHolder: "Posko Relawan Peduli Temanggung",
    badge: "Utama",
  },
  {
    bankName: "Bank Mandiri",
    accountNumber: "136-00-1928374-9",
    accountHolder: "Peduli Karhutla Temanggung",
  },
];

export function RekeningPoskoCard() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopy = async (accountNumber: string) => {
    try {
      const cleanNumber = accountNumber.replace(/-/g, "");
      await navigator.clipboard.writeText(cleanNumber);
      setCopiedAccount(accountNumber);
      setTimeout(() => {
        setCopiedAccount(null);
      }, 2500);
    } catch {
      // Fallback manual selection jika clipboard API tidak diizinkan
    }
  };

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Transfer Langsung</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[var(--color-foreground)]">
          Rekening Resmi Posko
        </h3>
        <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
          Pilihan transfer perbankan manual bagi donatur perorangan, lembaga sosial, maupun instansi kedinasan.
        </p>
      </div>

      {/* Daftar Rekening */}
      <div className="space-y-3">
        {BANK_ACCOUNTS.map((acc) => {
          const isCopied = copiedAccount === acc.accountNumber;
          return (
            <div
              key={acc.accountNumber}
              className="p-3.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-gray-400 transition-colors flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--color-foreground)]">
                    {acc.bankName}
                  </span>
                  {acc.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-primary)] text-white font-semibold">
                      {acc.badge}
                    </span>
                  )}
                </div>
                <div className="font-mono font-bold text-base sm:text-lg text-[var(--color-foreground)] tracking-tight">
                  {acc.accountNumber}
                </div>
                <div className="text-xs text-[var(--color-secondary)]">
                  a.n. <span className="font-medium text-[var(--color-foreground)]">{acc.accountHolder}</span>
                </div>
              </div>

              {/* Tombol Salin */}
              <button
                type="button"
                onClick={() => handleCopy(acc.accountNumber)}
                aria-label={`Salin nomor rekening ${acc.bankName}`}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                  isCopied
                    ? "bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]"
                    : "bg-white text-[var(--color-foreground)] border border-[var(--color-border)] hover:bg-gray-50 active:scale-95"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Catatan Konfirmasi */}
      <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
        <div className="flex items-start gap-2 text-xs text-[var(--color-secondary)] leading-relaxed">
          <AlertCircle className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <span>
            Jika menyalurkan bantuan melalui transfer manual ke rekening di atas, simpan bukti transfer Anda dan hubungi posko jika memerlukan kuitansi stempel resmi.
          </span>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/15 text-xs text-[var(--color-primary)] font-medium">
          <PhoneCall className="w-3.5 h-3.5 shrink-0" />
          <span>Layanan Informasi Posko: 0812-3456-7890 (Sekretariat Temanggung)</span>
        </div>
      </div>
    </div>
  );
}
