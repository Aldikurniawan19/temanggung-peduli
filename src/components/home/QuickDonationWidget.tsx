"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { formatNumberInput, parseNumberInput } from "@/lib/formatter";

const PRESET_AMOUNTS = [25000, 50000, 100000, 250000];

export function QuickDonationWidget() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [inputValue, setInputValue] = useState<string>("50.000");

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setInputValue(formatNumberInput(amount));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    if (!rawVal) {
      setInputValue("");
      setSelectedAmount(0);
      return;
    }
    const num = parseInt(rawVal, 10);
    setInputValue(formatNumberInput(num));
    setSelectedAmount(num);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseNumberInput(inputValue) || selectedAmount || 50000;
    router.push(`/donasi?amount=${finalAmount}`);
  };

  return (
    <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-[#E5ECE7] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="relative z-10">
        {/* Header: Title */}
        <div className="mb-2">
          <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Donasi Cepat
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          Setiap donasi Anda sangat berarti untuk mereka yang berjuang di garis depan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preset Buttons: Pill-shaped chips matching mockup */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {PRESET_AMOUNTS.map((amt) => {
              const isSelected = selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectPreset(amt)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all border ${
                    isSelected
                      ? "bg-[#137547] text-white border-[#137547] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200/90 hover:border-[#137547] hover:text-[#137547]"
                  }`}
                >
                  Rp {amt.toLocaleString("id-ID")}
                </button>
              );
            })}
          </div>

          {/* Custom Input Field with Rp prefix */}
          <div className="flex items-center rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-4 py-2.5 sm:py-3 focus-within:border-[#137547] focus-within:ring-2 focus-within:ring-[#137547]/20 transition-all">
            <span className="text-xs sm:text-sm font-bold text-slate-400 mr-2.5 select-none">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="50.000"
              className="w-full text-xs sm:text-sm md:text-base text-slate-900 outline-none placeholder:text-slate-400 bg-transparent font-semibold"
              aria-label="Nominal donasi kustom"
            />
          </div>

          {/* Submit Button: Pill-shaped with Arrow */}
          <button
            type="submit"
            className="w-full rounded-full bg-[#185334] hover:bg-[#124229] active:scale-[0.99] text-white py-3.5 px-6 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 shadow-xs transition-all group"
          >
            <span>Donasi Sekarang</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
