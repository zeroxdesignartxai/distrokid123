import { describe, expect, it } from "vitest";
import { createSlug, normalizeTitle, parseTrackFilename } from "../src/index";

describe("shared utils", () => {
  it("creates slugs from release names", () => {
    expect(createSlug("My First EP!"))
      .toBe("my-first-ep");
  });

  it("normalizes title spacing", () => {
    expect(normalizeTitle("  Hello   World  ")).toBe("Hello World");
  });

  it("parses numbered track filenames", () => {
    expect(parseTrackFilename("01-Intro.wav")).toEqual({
      trackNumber: 1,
      title: "Intro"
    });
  });
});
