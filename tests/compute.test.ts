import { describe, it, expect } from "vitest";
import { computeBreakdown } from "@/lib/compute";

describe("computeBreakdown", () => {
  it("splits equally for 1+1 parts", () => {
    const result = computeBreakdown(600, { a: 1, b: 1 });
    expect(result.a).toBeCloseTo(300);
    expect(result.b).toBeCloseTo(300);
  });

  it("handles weighted parts", () => {
    const result = computeBreakdown(600, { a: 2, b: 1 });
    expect(result.a).toBeCloseTo(400);
    expect(result.b).toBeCloseTo(200);
  });
});

