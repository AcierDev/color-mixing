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
  done: boolean;
  onChangeGrams: (grams: number) => void;
  onToggleDone: (done: boolean) => void;
};

export default function ColorCard({ color, baseColors, grams, done, onChangeGrams, onToggleDone }: Props) {
  const baseIds = baseColors.map((b) => b.id);
  const ratios = parseFormula(color.formula, baseIds);
  const breakdown = computeBreakdown(grams, ratios);

  const nonZeroBaseColors = baseColors.filter((b) => (breakdown[b.id] ?? 0) > 0);

  const handleAdjustGrams = (delta: number) => {
    const newGrams = Math.max(0, Math.min(100000, grams + delta));
    onChangeGrams(newGrams);
  };

  return (
    <Card className={`transition-colors ${
      done 
        ? 'border-green-400 bg-green-50' 
        : 'border-gray-200 bg-white'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                done 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-gray-500 bg-gray-100'
              }`}>
                {color.id}
              </span>
              <CardTitle className={`text-base font-semibold ${
                done ? 'text-green-900' : 'text-gray-900'
              }`}>
                {color.label}
              </CardTitle>
            </div>
          </div>
          <Button
            variant={done ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleDone(!done)}
            className={`transition-all ${
              done
                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                : 'border-gray-300'
            }`}
          >
            {done ? '✓ Done' : 'Mark Done'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustGrams(-50)}
            disabled={grams === 0}
            className="border-gray-300"
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
            className="h-10 w-32 text-center font-medium"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustGrams(50)}
            disabled={grams >= 100000}
            className="border-gray-300"
          >
            +50
          </Button>
          <span className="text-sm text-gray-500 ml-1">grams</span>
        </div>

        {nonZeroBaseColors.length > 0 && (
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Base Colors
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {nonZeroBaseColors.map((b) => (
                <div key={b.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-700">{b.name}</span>
                  <span className="font-semibold text-gray-900">{formatGrams(breakdown[b.id] ?? 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

