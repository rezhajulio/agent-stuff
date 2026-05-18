import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createMockPI, createMockContext } from "./helpers";

// Mock the dependencies before importing
vi.mock("@earendil-works/pi-coding-agent", () => ({
  getMarkdownTheme: vi.fn().mockReturnValue({}),
}));

vi.mock("@earendil-works/pi-tui", () => ({
  Container: vi.fn().mockImplementation(() => ({
    addChild: vi.fn(),
  })),
  Markdown: vi.fn(),
  Spacer: vi.fn(),
  Text: vi.fn(),
}));

describe("web-search extension", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear env and auth.json related vars
    delete process.env.TAVILY_API_KEY;
    delete process.env.TAVILY_CONTEXT_BUDGET;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("registers web_search, web_extract, and web_crawl tools", async () => {
    const pi = createMockPI();
    const { default: webSearch } = await import("../pi-extensions/web-search");
    webSearch(pi);

    expect(pi._tools["web_search"]).toBeDefined();
    expect(pi._tools["web_extract"]).toBeDefined();
    expect(pi._tools["web_crawl"]).toBeDefined();
  });

  it("web_search tool has correct parameters", async () => {
    const pi = createMockPI();
    const { default: webSearch } = await import("../pi-extensions/web-search");
    webSearch(pi);

    const tool = pi._tools["web_search"];
    expect(tool.name).toBe("web_search");
    expect(tool.description).toContain("Tavily");
    expect(tool.parameters).toBeDefined();
  });

  it("web_extract tool has correct parameters", async () => {
    const pi = createMockPI();
    const { default: webSearch } = await import("../pi-extensions/web-search");
    webSearch(pi);

    const tool = pi._tools["web_extract"];
    expect(tool.name).toBe("web_extract");
    expect(tool.parameters).toBeDefined();
  });

  it("web_crawl tool has correct parameters", async () => {
    const pi = createMockPI();
    const { default: webSearch } = await import("../pi-extensions/web-search");
    webSearch(pi);

    const tool = pi._tools["web_crawl"];
    expect(tool.name).toBe("web_crawl");
    expect(tool.parameters).toBeDefined();
  });

  it("web_search has renderCall function", async () => {
    const pi = createMockPI();
    const { default: webSearch } = await import("../pi-extensions/web-search");
    webSearch(pi);

    const tool = pi._tools["web_search"];
    expect(typeof tool.renderCall).toBe("function");
  });

  it("web_search has renderResult function", async () => {
    const pi = createMockPI();
    const { default: webSearch } = await import("../pi-extensions/web-search");
    webSearch(pi);

    const tool = pi._tools["web_search"];
    expect(typeof tool.renderResult).toBe("function");
  });
});
