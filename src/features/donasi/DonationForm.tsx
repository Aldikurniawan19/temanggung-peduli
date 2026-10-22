"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, User, Mail, MessageSquare, EyeOff, ShieldCheck, Check } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site-config";
import { formatRupiah } from "@/lib/formatter";
import { donationFormSchema } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { PaymentStatusModal } from "@/features/payment/MidtransSnap";
import type { MidtransResult } from "@/types/midtrans";

export function DonationForm() {
  const searchParams = useSearchParams();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(50000);
  const [customAmount, setCustomAmount] = useState<string>("50000");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const paramAmount = searchParams?.get("amount");
    if (paramAmount) {
      const num = parseInt(paramAmount, 10);
      if (!isNaN(num) && num > 0) {
        setCustomAmount(num.toString());
        if (SITE_CONFIG.nominalPresets.includes(num as any)) {
          setSelectedPreset(num);
        } else {
          setSelectedPreset(null);
        }
      }
    }
  }, [searchParams]);

  // Status Modal State
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    status: "success" | "pending" | "error";
    orderId?: string;
    amount?: number;
  }>({
    isOpen: false,
    status: "success",
  });

  const handleSelectPreset = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount(amount.toString());
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    setCustomAmount(rawVal);
    const num = parseInt(rawVal, 10);
    if (SITE_CONFIG.nominalPresets.includes(num as any)) {
      setSelectedPreset(num);
    } else {
      setSelectedPreset(null);
    }
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const amountNum = parseInt(customAmount || "0", 10);
    const nameToSubmit = isAnonymous ? (donorName.trim() || "Hamba Allah") : donorName.trim();

    const validation = donationFormSchema.safeParse({
      donorName: nameToSubmit,
      donorEmail: donorEmail.trim() || undefined,
      isAnonymous,
      amount: amountNum,
      message: message.trim() || undefined,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const fieldName = err.path[0]?.toString() || "form";
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memproses donasi");
      }

      const { snapToken, orderId, redirectUrl } = json.data;

      // Jika window.snap ada (Midtrans script ter-load) dan token bukan mock/sandbox
      if (
        typeof window !== "undefined" &&
        window.snap &&
        snapToken &&
        !snapToken.startsWith("mock-") &&
        !snapToken.startsWith("sandbox-token-")
      ) {
        window.snap.pay(snapToken, {
          onSuccess: (result: MidtransResult) => {
            setStatusModal({
              isOpen: true,
              status: "success",
              orderId: result.order_id,
              amount: amountNum,
            });
            resetForm();
          },
          onPending: (result: MidtransResult) => {
            setStatusModal({
              isOpen: true,
              status: "pending",
              orderId: result.order_id,
              amount: amountNum,
            });
            resetForm();
          },
          onError: () => {
            setStatusModal({
              isOpen: true,
              status: "error",
              orderId,
            });
          },
          onClose: () => {
            setIsLoading(false);
          },
        });
      } else {
        // Simpan donasi langsung ke database Supabase (terverifikasi langsung)
        const directRes = await fetch("/api/donasi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.data),
        });
        const directJson = await directRes.json();
        const finalOrderId = directJson.data?.orderId || orderId;

        setStatusModal({
          isOpen: true,
          status: "success",
          orderId: finalOrderId,
          amount: amountNum,
        });
        resetForm();
      }
    } catch (err: any) {
      setErrors({ form: err.message || "Terjadi kesalahan saat memproses pembayaran" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDonorName("");
    setDonorEmail("");
    setMessage("");
    setIsAnonymous(false);
    setErrors({});
  };

  return (
    <>
      <Card className="max-w-xl mx-auto shadow-sm border-[var(--color-border)]">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-[var(--color-primary)]" />
            <span>Formulir Donasi Online</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Salurkan Kepedulian Anda
          </CardTitle>
          <CardDescription>
            Bantuan Anda melalui gerakan Temanggung Peduli langsung dialokasikan untuk logistik regu pemadam, masker penangkal asap warga, dan pemulihan vegetasi lahan gambut di Kalimantan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="p-3.5 rounded-lg bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm font-medium">
                {errors.form}
              </div>
            )}

            {/* Pilihan Nominal Cepat */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-foreground)]">
                Pilih Nominal Donasi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SITE_CONFIG.nominalPresets.map((amount) => {
                  const isSelected = selectedPreset === amount;
                  return (
                    <button
                      type="button"
                      key={amount}
                      onClick={() => handleSelectPreset(amount)}
                      className={`relative py-3 px-3 rounded-lg text-sm font-semibold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        isSelected
                          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs"
                          : "bg-white text-[var(--color-foreground)] border-[var(--color-border)] hover:border-gray-400"
                      }`}
                    >
                      {formatRupiah(amount)}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 absolute top-2 right-2 text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Nominal Kustom */}
            <Input
              label="Nominal Lainnya (Rp)"
              type="text"
              inputMode="numeric"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Contoh: 150000"
              leftAddon={<span className="font-semibold text-xs">Rp</span>}
              error={errors.amount}
              helperText="Minimal donasi Rp 10.000"
              required
            />

            {/* Opsi Toggle Anonim */}
            <div className="bg-[var(--color-background)] rounded-xl p-4 border border-[var(--color-border)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary-light)] flex items-center justify-center text-[var(--color-secondary)]">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[var(--color-foreground)] block">
                      Donasi sebagai Anonim
                    </span>
                    <span className="text-xs text-[var(--color-secondary)] block">
                      Nama publik Anda akan ditampilkan sebagai &quot;Hamba Allah&quot;
                    </span>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAnonymous}
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                    isAnonymous ? "bg-[var(--color-primary)]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isAnonymous ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Input Nama Donatur */}
            <Input
              label={isAnonymous ? "Nama Donatur (Disimpan untuk verifikasi admin)" : "Nama Lengkap"}
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder={isAnonymous ? "Nama Anda (disamarkan di publik)" : "Masukkan nama lengkap Anda"}
              leftAddon={<User className="w-4 h-4" />}
              error={errors.donorName}
              required={!isAnonymous}
            />

            {/* Input Email (Opsional) */}
            <Input
              label="Alamat Email (Opsional)"
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="nama@email.com untuk bukti tanda terima"
              leftAddon={<Mail className="w-4 h-4" />}
              error={errors.donorEmail}
              helperText="Digunakan untuk pengiriman bukti pembayaran digital"
            />

            {/* Input Pesan / Doa */}
            <Textarea
              label="Pesan atau Doa Penguat (Opsional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan penyemangat untuk warga terdampak dan para relawan pemadam..."
              error={errors.message}
              helperText="Pesan Anda akan tampil di dinding doa setelah diverifikasi"
            />

            {/* Keamanan & Tombol Bayar */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-2 text-xs text-[var(--color-secondary)]">
                <ShieldCheck className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                <span>Pembayaran aman terenkripsi via Midtrans Snap Sandbox</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                leftIcon={<Heart className="w-5 h-5 fill-white" />}
              >
                Lanjutkan Donasi {customAmount ? formatRupiah(parseInt(customAmount, 10) || 0) : ""}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal Status Transaksi */}
      <PaymentStatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal((prev) => ({ ...prev, isOpen: false }))}
        status={statusModal.status}
        orderId={statusModal.orderId}
        amount={statusModal.amount}
      />
    </>
  );
}
