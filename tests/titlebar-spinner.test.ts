import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createMockPI, createMockContext, triggerHandler } from "./helpers";

import titlebarSpinner from "../pi-extensions/titlebar-spinner";

describe("titlebar-spinner extension", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("registers agent_start, agent_end, and session_shutdown handlers", () => {
    const pi = createMockPI();
    titlebarSpinner(pi);

    expect(pi._handlers["agent_start"]).toBeDefined();
    expect(pi._handlers["agent_end"]).toBeDefined();
    expect(pi._handlers["session_shutdown"]).toBeDefined();
  });

  it("starts spinner animation on agent_start", async () => {
    const pi = createMockPI();
    const ctx = createMockContext();
    titlebarSpinner(pi);

    await triggerHandler(pi, "agent_start", {}, ctx);

    // First call is base title from stopAnimation inside startAnimation
    // Second call is after first interval tick
    vi.advanceTimersByTime(80);

    expect(ctx.ui.setTitle).toHaveBeenCalled();
    const lastTitle = vi.mocked(ctx.ui.setTitle).mock.lastCall?.[0] as string;
    expect(lastTitle).toMatch(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/);
  });

  it("stops animation and resets title on agent_end", async () => {
    const pi = createMockPI();
    const ctx = createMockContext();
    titlebarSpinner(pi);

    // Start animation
    await triggerHandler(pi, "agent_start", {}, ctx);
    vi.mocked(ctx.ui.setTitle).mockClear();

    // Stop animation
    await triggerHandler(pi, "agent_end", {}, ctx);

    // Title should be reset without braille
    const title = vi.mocked(ctx.ui.setTitle).mock.lastCall?.[0] as string;
    expect(title).not.toMatch(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/);
  });

  it("animates through braille frames", async () => {
    const pi = createMockPI();
    const ctx = createMockContext();
    titlebarSpinner(pi);

    await triggerHandler(pi, "agent_start", {}, ctx);

    const titles: string[] = [];
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(80);
      const title = vi.mocked(ctx.ui.setTitle).mock.lastCall?.[0] as string;
      titles.push(title);
    }

    // Should have different frames
    const uniqueFrames = new Set(titles.map((t) => t[0]));
    expect(uniqueFrames.size).toBeGreaterThan(1);
  });

  it("includes session name in title when set", async () => {
    const pi = createMockPI();
    pi.getSessionName = vi.fn().mockReturnValue("my-session");
    const ctx = createMockContext();
    titlebarSpinner(pi);

    await triggerHandler(pi, "agent_start", {}, ctx);
    vi.advanceTimersByTime(80);

    const title = vi.mocked(ctx.ui.setTitle).mock.lastCall?.[0] as string;
    expect(title).toContain("my-session");
  });
});
