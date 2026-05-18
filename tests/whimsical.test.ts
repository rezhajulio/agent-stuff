import { describe, it, expect, vi } from "vitest";
import { createMockPI, createMockContext, triggerHandler } from "./helpers";

// Import the extension module
import whimsical from "../pi-extensions/whimsical";

describe("whimsical extension", () => {
  it("registers turn_start and turn_end handlers", () => {
    const pi = createMockPI();
    whimsical(pi);

    expect(pi._handlers["turn_start"]).toBeDefined();
    expect(pi._handlers["turn_end"]).toBeDefined();
    expect(pi._handlers["turn_start"].length).toBe(1);
    expect(pi._handlers["turn_end"].length).toBe(1);
  });

  it("sets a working message on turn_start", async () => {
    const pi = createMockPI();
    const ctx = createMockContext();
    whimsical(pi);

    await triggerHandler(pi, "turn_start", {}, ctx);

    expect(ctx.ui.setWorkingMessage).toHaveBeenCalledOnce();
    const message = vi.mocked(ctx.ui.setWorkingMessage).mock.calls[0][0];
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
  });

  it("clears working message on turn_end", async () => {
    const pi = createMockPI();
    const ctx = createMockContext();
    whimsical(pi);

    await triggerHandler(pi, "turn_end", {}, ctx);

    expect(ctx.ui.setWorkingMessage).toHaveBeenCalledOnce();
    expect(vi.mocked(ctx.ui.setWorkingMessage).mock.calls[0][0]).toBeUndefined();
  });

  it("returns different messages on multiple calls", async () => {
    const pi = createMockPI();
    const ctx = createMockContext();
    whimsical(pi);

    const messages = new Set<string>();
    for (let i = 0; i < 20; i++) {
      await triggerHandler(pi, "turn_start", {}, ctx);
      const msg = vi.mocked(ctx.ui.setWorkingMessage).mock.lastCall?.[0];
      if (msg) messages.add(msg);
      vi.mocked(ctx.ui.setWorkingMessage).mockClear();
    }

    // With 100+ messages in the pool, we should get several unique ones
    expect(messages.size).toBeGreaterThan(5);
  });
});
