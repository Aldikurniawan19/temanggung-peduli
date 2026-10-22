"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { prayerFormSchema } from "@/lib/validators";
import { Input, Textarea } from "@/components/ui/Input";

export interface PrayerFormProps {
  onSuccess?: () => void;
}

export function PrayerForm({ onSuccess }: PrayerFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = prayerFormSchema.safeParse({
      name: name.trim(),
      message: message.trim(),
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
      const res = await fetch("/api/ucapan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengirim doa dan ucapan");
      }

      setName("");
      setMessage("");
      if (onSuccess) onSuccess();

      // Otomatis restart / reload web agar pesan langsung tampil di dinding doa
      if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setErrors({ form: err.message || "Terjadi kendala saat mengirim ucapan" });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-7 space-y-5">
      <div>
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          Tuliskan Doa & Semangat
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
          Untaian doa tulus Anda menjadi suntikan moril berharga bagi relawan dan saudara kita di Kalimantan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
            {errors.form}
          </div>
        )}

        <Input
          label="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama atau inisial Anda"
          error={errors.name}
          required
        />

        <Textarea
          label="Isi Doa & Ucapan Semangat"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Semoga api lekas padam, seluruh relawan diberikan keselamatan, dan alam kembali lestari..."
          error={errors.message}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#185334] hover:bg-[#15462c] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <span>{isLoading ? "Mengirimkan Doa..." : "Kirim Doa & Ucapan"}</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
