"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type BaseColor = {
  id: string;
  name: string;
};

type DesignColor = {
  id: string;
  label: string;
  formula: string;
};

type Design = {
  id: string;
  name: string;
  colors: DesignColor[];
};
import { parseFormula } from "@/lib/formula";
import { computeBreakdown } from "@/lib/compute";
import ColorCard from "@/components/ColorCard";
import { loadJSON, saveJSON } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  baseColors: BaseColor[];
  design: Design;
};

export default function DesignMixView({ baseColors, design }: Props) {
  const baseIds = useMemo(() => baseColors.map((b) => b.id), [baseColors]);

  const [targets, setTargets] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const c of design.colors) { initial[c.id] = 600; }
    return initial;
  });
  const [included, setIncluded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const c of design.colors) { initial[c.id] = true; }
    return initial;
  });

  // Load persisted state
  useEffect(() => {
    const loadedTargets = loadJSON<Record<string, number>>(
      `targets:${design.id}`,
      targets
    );
    const loadedIncluded = loadJSON<Record<string, boolean>>(
      `included:${design.id}`,
      included
    );
    setTargets(loadedTargets);
    setIncluded(loadedIncluded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design.id]);

  // Persist on change
  useEffect(() => {
    saveJSON(`targets:${design.id}`, targets);
  }, [design.id, targets]);
  useEffect(() => {
    saveJSON(`included:${design.id}`, included);
  }, [design.id, included]);

  const overallGrams = useMemo(() => {
    const includedGrams = design.colors
      .filter((c: DesignColor) => included[c.id])
      .map((c: DesignColor) => targets[c.id] ?? 0);
    if (includedGrams.length === 0) return 600;
    const avg = includedGrams.reduce((a: number, b: number) => a + b, 0) / includedGrams.length;
    return Math.round(avg);
  }, [design.colors, targets, included]);

  const handleOverallGramsChange = (grams: number) => {
    const newTargets = { ...targets };
    design.colors.forEach((c: DesignColor) => {
      if (included[c.id]) {
        newTargets[c.id] = grams;
      }
    });
    setTargets(newTargets);
  };

  const visibleColors = design.colors.filter((c: DesignColor) => {
    const grams = included[c.id] ? targets[c.id] ?? 0 : 0;
    return grams > 0;
  });

  return (
    <main className="mx-auto max-w-md p-4 pb-8">
      <header className="sticky top-0 z-10 -mx-4 mb-4 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur">
        <Link href="/" className="inline-block mb-2">
          <Button variant="outline" size="sm">
            ← Back to Designs
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">{design.name}</h1>
        <div className="mt-3 flex items-center gap-3">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            max={100000}
            step={1}
            value={overallGrams}
            onChange={(e) => handleOverallGramsChange(Math.max(0, Math.min(100000, Number(e.target.value || 0))))}
            className="h-10 w-28"
          />
          <span className="text-sm text-zinc-600">grams (all colors)</span>
        </div>
      </header>

      <div className="space-y-3">
        {visibleColors.map((c: DesignColor) => (
          <ColorCard
            key={c.id}
            color={c}
            baseColors={baseColors}
            grams={targets[c.id] ?? 0}
            included={included[c.id] ?? false}
            onChangeGrams={(g) => setTargets((t) => ({ ...t, [c.id]: g }))}
            onToggleIncluded={(v) => setIncluded((t) => ({ ...t, [c.id]: v }))}
          />
        ))}
      </div>
    </main>
  );
}

