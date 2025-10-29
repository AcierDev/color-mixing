"use client";

import type { BaseColor, DesignColor } from "@/types";
import { parseFormula } from "@/lib/formula";
import { computeBreakdown, formatGrams } from "@/lib/compute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = {
  color: DesignColor;
  baseColors: BaseColor[];
  grams: number;
  included: boolean;
  onChangeGrams: (grams: number) => void;
  onToggleIncluded: (included: boolean) => void;
};

export default function ColorCard({ color, baseColors, grams, included, onChangeGrams, onToggleIncluded }: Props) {
  const baseIds = baseColors.map((b) => b.id);
  const ratios = parseFormula(color.formula, baseIds);
  const breakdown = computeBreakdown(included ? grams : 0, ratios);

  return (
    <Card className="border-zinc-200">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-medium">{color.id}. {color.label}</CardTitle>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-5 accent-black"
              checked={included}
              onChange={(e) => onToggleIncluded(e.target.checked)}
            />
            Include
          </label>
        </div>
        <p className="text-xs text-zinc-600">{color.formula}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            max={100000}
            step={1}
            value={grams}
            onChange={(e) => onChangeGrams(Math.max(0, Math.min(100000, Number(e.target.value || 0))))}
            className="h-10 w-28"
          />
          <span className="text-sm">grams</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {baseColors.map((b) => (
            <div key={b.id} className="flex items-center justify-between">
              <span className="text-zinc-600">{b.name}</span>
              <span className="font-medium">{formatGrams(breakdown[b.id] ?? 0)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

