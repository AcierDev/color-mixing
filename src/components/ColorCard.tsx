"use client";

type BaseColor = {
  id: string;
  name: string;
};

type DesignColor = {
  id: string;
  label: string;
  formula: string;
};
import { parseFormula } from "@/lib/formula";
import { computeBreakdown, formatGrams } from "@/lib/compute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const nonZeroBaseColors = baseColors.filter((b) => (breakdown[b.id] ?? 0) > 0);

  const handleAdjustGrams = (delta: number) => {
    const newGrams = Math.max(0, Math.min(100000, grams + delta));
    onChangeGrams(newGrams);
  };

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
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustGrams(-50)}
            disabled={grams === 0}
          >
            -50
          </Button>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustGrams(50)}
            disabled={grams >= 100000}
          >
            +50
          </Button>
          <span className="text-sm text-zinc-600">grams</span>
        </div>

        {nonZeroBaseColors.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {nonZeroBaseColors.map((b) => (
              <div key={b.id} className="flex items-center justify-between">
                <span className="text-zinc-600">{b.name}</span>
                <span className="font-medium">{formatGrams(breakdown[b.id] ?? 0)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

