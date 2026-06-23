import { describe, it, expect } from "vitest";
import { cn, toSentenceCase } from "./utils";

describe("toSentenceCase", () => {
  it("uppercases the first letter and lowercases the rest", () => {
    expect(toSentenceCase("temp")).toBe("Temp");
    expect(toSentenceCase("TEMP")).toBe("Temp");
    expect(toSentenceCase("tEmP")).toBe("Temp");
  });

  it("trims surrounding whitespace", () => {
    expect(toSentenceCase("  hi there  ")).toBe("Hi there");
  });

  it("only capitalizes the first word (sentence case, not title case)", () => {
    expect(toSentenceCase("in progress")).toBe("In progress");
  });

  it("returns an empty string for blank input", () => {
    expect(toSentenceCase("")).toBe("");
    expect(toSentenceCase("   ")).toBe("");
  });
});

describe("cn", () => {
  it("merges conflicting tailwind classes, last wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });
});
