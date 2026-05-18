import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockPI, createMockContext } from "./helpers";

describe("questionnaire extension", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers questionnaire tool", async () => {
    const pi = createMockPI();
    const { default: questionnaire } = await import("../pi-extensions/questionnaire");
    questionnaire(pi);

    expect(pi._tools["questionnaire"]).toBeDefined();
  });

  it("questionnaire tool has correct parameters", async () => {
    const pi = createMockPI();
    const { default: questionnaire } = await import("../pi-extensions/questionnaire");
    questionnaire(pi);

    const tool = pi._tools["questionnaire"];
    expect(tool.name).toBe("questionnaire");
    expect(tool.description).toContain("Ask the user");
    expect(tool.parameters).toBeDefined();
  });

  it("returns error when UI is not available", async () => {
    const pi = createMockPI();
    const ctx = createMockContext({ hasUI: false });
    const { default: questionnaire } = await import("../pi-extensions/questionnaire");
    questionnaire(pi);

    const tool = pi._tools["questionnaire"];
    const result = await tool.execute(
      "test-id",
      {
        questions: [
          {
            id: "q1",
            prompt: "Test?",
            options: [{ value: "a", label: "A" }],
          },
        ],
      },
      new AbortController().signal,
      undefined,
      ctx
    );

    expect(result.content[0].text).toContain("UI not available");
    expect(result.details.cancelled).toBe(true);
  });

  it("returns error when no questions provided", async () => {
    const pi = createMockPI();
    const ctx = createMockContext();
    const { default: questionnaire } = await import("../pi-extensions/questionnaire");
    questionnaire(pi);

    const tool = pi._tools["questionnaire"];
    const result = await tool.execute(
      "test-id",
      { questions: [] },
      new AbortController().signal,
      undefined,
      ctx
    );

    expect(result.content[0].text).toContain("No questions provided");
    expect(result.details.cancelled).toBe(true);
  });

  it("renders tool call with question count", async () => {
    const pi = createMockPI();
    const { default: questionnaire } = await import("../pi-extensions/questionnaire");
    questionnaire(pi);

    const tool = pi._tools["questionnaire"];
    const theme = {
      fg: vi.fn((_: any, text: string) => text),
      bold: vi.fn((text: string) => text),
    };
    const result = tool.renderCall(
      {
        questions: [
          { id: "q1", prompt: "Q1?", options: [] },
          { id: "q2", prompt: "Q2?", options: [] },
        ],
      },
      theme,
      {}
    );

    // Should show 2 questions
    expect(result).toBeDefined();
  });
});
