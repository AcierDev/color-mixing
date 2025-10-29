export type RatioMap = Record<string, number>;

const PART_REGEX = /^(?<count>\d+(?:\.\d+)?)\s*part(?:s)?\s+(?<id>[a-z0-9\-]+)/i;

function normalizeId(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

/**
 * Parse human-friendly formula strings into a ratio map of base color id -> parts.
 * Supported patterns:
 * - "toasty-fireplace"
 * - "A + B" (implies 1 part each)
 * - "2 parts A + 1 part B"
 */
export function parseFormula(formula: string, baseIds: string[]): RatioMap {
  const ratios: RatioMap = {};
  if (!formula) return ratios;

  const known = new Set(baseIds.map(normalizeId));

  const segments = formula
    .toLowerCase()
    .split("+")
    .map((seg) => seg.trim())
    .filter(Boolean);

  for (const segment of segments) {
    let count = 1;
    let id: string | null = null;

    const m = segment.match(PART_REGEX);
    if (m && m.groups) {
      count = parseFloat(m.groups.count);
      id = normalizeId(m.groups.id);
    } else {
      // bare id like "toasty-fireplace" or label words
      id = normalizeId(segment.replace(/\bparts?\b/g, "").trim());
    }

    if (!id) continue;
    if (!known.has(id)) {
      // If unknown, skip silently for now to avoid hard crashes on data issues
      // Could throw or log in future with diagnostics UI
      continue;
    }

    ratios[id] = (ratios[id] ?? 0) + (isFinite(count) ? count : 1);
  }

  return ratios;
}

export function sumParts(ratios: RatioMap): number {
  return Object.values(ratios).reduce((a, b) => a + b, 0);
}

