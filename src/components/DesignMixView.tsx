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
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const c of design.colors) { initial[c.id] = false; }
    return initial;
  });

  // Load persisted state
  useEffect(() => {
    const loadedTargets = loadJSON<Record<string, number>>(
      `targets:${design.id}`,
      targets
    );
    const loadedDone = loadJSON<Record<string, boolean>>(
      `done:${design.id}`,
      done
    );
    setTargets(loadedTargets);
    setDone(loadedDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design.id]);

  // Persist on change
  useEffect(() => {
    saveJSON(`targets:${design.id}`, targets);
  }, [design.id, targets]);
  useEffect(() => {
    saveJSON(`done:${design.id}`, done);
  }, [design.id, done]);

  const overallGrams = useMemo(() => {
    const allGrams = design.colors.map((c: DesignColor) => targets[c.id] ?? 0);
    if (allGrams.length === 0) return 600;
    const avg = allGrams.reduce((a: number, b: number) => a + b, 0) / allGrams.length;
    return Math.round(avg);
  }, [design.colors, targets]);

  const handleOverallGramsChange = (grams: number) => {
    const newTargets = { ...targets };
    design.colors.forEach((c: DesignColor) => {
      newTargets[c.id] = grams;
    });
    setTargets(newTargets);
  };

  const visibleColors = design.colors;

  return (
    <main className="mx-auto max-w-3xl p-6 pb-8">
      <header className="sticky top-0 z-10 -mx-6 mb-6 border-b border-gray-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Link href="/" className="inline-block mb-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            ← Back to Designs
          </Button>
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{design.name}</h1>
            <p className="text-sm text-gray-600">
              {design.colors.length} total colors • {Object.values(done).filter(Boolean).length} completed
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1">
              Bulk Adjust All Colors
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                max={100000}
                step={1}
                value={overallGrams}
                onChange={(e) => handleOverallGramsChange(Math.max(0, Math.min(100000, Number(e.target.value || 0))))}
                className="h-10 w-36 text-center font-medium"
              />
              <span className="text-sm text-gray-600">grams</span>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {visibleColors.map((c: DesignColor) => (
          <ColorCard
            key={c.id}
            color={c}
            baseColors={baseColors}
            grams={targets[c.id] ?? 0}
            done={done[c.id] ?? false}
            onChangeGrams={(g) => setTargets((t) => ({ ...t, [c.id]: g }))}
            onToggleDone={(v) => setDone((t) => ({ ...t, [c.id]: v }))}
          />
        ))}
      </div>
    </main>
  );
}

