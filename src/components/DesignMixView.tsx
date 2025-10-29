"use client";

import { useEffect, useMemo, useState } from "react";
import type { BaseColor, Design } from "@/types";
import { parseFormula } from "@/lib/formula";
import { aggregateTotals, computeBreakdown, formatGrams } from "@/lib/compute";
import ColorCard from "@/components/ColorCard";
import { loadJSON, saveJSON } from "@/lib/storage";

type Props = {
  baseColors: BaseColor[];
  design: Design;
};

export default function DesignMixView({ baseColors, design }: Props) {
  const baseIds = useMemo(() => baseColors.map((b) => b.id), [baseColors]);

  const [targets, setTargets] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const c of design.colors) initial[c.id] = 600;
    return initial;
  });
  const [included, setIncluded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const c of design.colors) initial[c.id] = true;
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

  const perColorBreakdowns = useMemo(() => {
    return design.colors.map((c) => {
      const ratios = parseFormula(c.formula, baseIds);
      const grams = included[c.id] ? targets[c.id] ?? 0 : 0;
      return computeBreakdown(grams, ratios);
    });
  }, [design.colors, baseIds, targets, included]);

  const totals = useMemo(() => aggregateTotals(perColorBreakdowns), [perColorBreakdowns]);

  return (
    <main className="mx-auto max-w-md p-4 pb-28">
      <header className="sticky top-0 z-10 -mx-4 mb-4 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-semibold">{design.name}</h1>
        <p className="text-sm text-zinc-600">Tap a color to set grams (default 600g)</p>
      </header>

      <div className="space-y-3">
        {design.colors.map((c) => (
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

      <footer className="fixed bottom-0 left-0 right-0 mx-auto max-w-md border-t border-zinc-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">Overall totals</span>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm active:scale-[0.99]"
              onClick={() => {
                const lines = baseColors.map((b) => `${b.name}: ${formatGrams(totals[b.id] ?? 0)}`);
                const text = `${design.name} totals\n` + lines.join("\n");
                void navigator.clipboard.writeText(text);
              }}
            >
              Copy
            </button>
            <button
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white active:scale-[0.99]"
              onClick={async () => {
                const lines = baseColors.map((b) => `${b.name}: ${formatGrams(totals[b.id] ?? 0)}`);
                const text = `${design.name} totals\n` + lines.join("\n");
                if ((navigator as any).share) {
                  try {
                    await (navigator as any).share({ text, title: design.name });
                  } catch {}
                } else {
                  void navigator.clipboard.writeText(text);
                }
              }}
            >
              Share
            </button>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {baseColors.map((b) => (
            <div key={b.id} className="flex items-center justify-between">
              <span className="text-zinc-600">{b.name}</span>
              <span className="font-medium">{formatGrams(totals[b.id] ?? 0)}</span>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}

