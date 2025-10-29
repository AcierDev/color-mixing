import type { RatioMap } from "./formula";

export function computeBreakdown(targetGrams: number, ratios: RatioMap): RatioMap {
  const totalParts = Object.values(ratios).reduce((a, b) => a + b, 0);
  if (!totalParts || targetGrams <= 0) {
    return Object.fromEntries(Object.keys(ratios).map((k) => [k, 0]));
  }
  const factor = targetGrams / totalParts;
  return Object.fromEntries(
    Object.entries(ratios).map(([k, v]) => [k, v * factor])
  );
}

export function formatGrams(value: number): string {
  const rounded = Math.round(value);
  return `${rounded}g`;
}

export function aggregateTotals(rows: RatioMap[]): RatioMap {
  const totals: RatioMap = {};
  for (const row of rows) {
    for (const [k, v] of Object.entries(row)) {
      totals[k] = (totals[k] ?? 0) + v;
    }
  }
  return totals;
}

