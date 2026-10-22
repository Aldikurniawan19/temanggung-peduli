"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { MIDTRANS_CONFIG, getSnapScriptUrl } from "@/lib/midtrans";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { MidtransResult } from "@/types/midtrans";

export interface MidtransSnapProps {
  onSuccess?: (result: MidtransResult) => void;
  onPending?: (result: MidtransResult) => void;
  onError?: (result: MidtransResult) => void;
  onClose?: () => void;
}

export function MidtransSnap() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.snap) {
      setIsScriptLoaded(true);
    }
  }, []);

  return (
    <Script
      src={getSnapScriptUrl()}
      data-client-key={MIDTRANS_CONFIG.clientKey}
      strategy="afterInteractive"
      onLoad={() => setIsScriptLoaded(true)}
    />
  );
}

export interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "pending" | "error";
  orderId?: string;
  amount?: number;
}

export function PaymentStatusModal({
  isOpen,
  onClose,
  status,
  orderId,
  amount,
}: PaymentStatusModalProps) {
  const config = {
    success: {
      title: "Donasi Berhasil Diterima",
      description: "Terima kasih atas kepedulian Anda untuk penanganan karhutla Temanggung.",
      icon: <CheckCircle2 className="w-12 h-12 text-[var(--color-success)] mx-auto mb-3" />,
      actionText: "Kembali ke Beranda",
    },
    pending: {
      title: "Menunggu Pembayaran",
      description: "Instruksi pembayaran telah diterbitkan. Silakan selesaikan transaksi sesuai metode yang Anda pilih.",
      icon: <Clock className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-3" />,
      actionText: "Saya Mengerti",
    },
    error: {
      title: "Pembayaran Belum Berhasil",
      description: "Transaksi tidak dapat diselesaikan atau telah dibatalkan. Anda dapat mengulangi donasi kapan saja.",
      icon: <AlertCircle className="w-12 h-12 text-[var(--color-danger)] mx-auto mb-3" />,
      actionText: "Coba Lagi",
    },
  }[status];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center py-4 space-y-4">
        {config.icon}
        <h3 className="text-lg font-bold text-[var(--color-foreground)]">
          {config.title}
        </h3>
        <p className="text-sm text-[var(--color-secondary)] leading-relaxed">
          {config.description}
        </p>

        {orderId && (
          <div className="bg-[var(--color-background)] rounded-lg p-3 text-xs text-[var(--color-secondary)] space-y-1">
            <div>ID Pesanan: <span className="font-mono font-medium text-[var(--color-foreground)]">{orderId}</span></div>
            {amount && <div>Jumlah: <span className="font-semibold text-[var(--color-foreground)]">Rp {amount.toLocaleString("id-ID")}</span></div>}
          </div>
        )}

        <Button variant="primary" size="md" className="w-full mt-4" onClick={onClose}>
          {config.actionText}
        </Button>
      </div>
    </Modal>
  );
}
