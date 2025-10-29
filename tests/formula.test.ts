import { describe, it, expect } from "vitest";
import { parseFormula } from "@/lib/formula";

const baseIds = [
  "toasty-fireplace",
  "cosy-chair",
  "ballroom-dancing",
  "academy-gray",
  "peaceful-slumber",
  "midnight-bayou",
  "indigo-streamer",
];

describe("parseFormula", () => {
  it("parses single base color", () => {
    const r = parseFormula("toasty-fireplace", baseIds);
    expect(r).toEqual({ "toasty-fireplace": 1 });
  });

  it("parses 1+1 mix", () => {
    const r = parseFormula("1 part toasty-fireplace + 1 part cosy-chair", baseIds);
    expect(r).toEqual({ "toasty-fireplace": 1, "cosy-chair": 1 });
  });

  it("parses weighted mix", () => {
    const r = parseFormula("2 parts ballroom-dancing + 1 part academy-gray", baseIds);
    expect(r).toEqual({ "ballroom-dancing": 2, "academy-gray": 1 });
  });
});

