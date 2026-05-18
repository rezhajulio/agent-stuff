import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockPI, createMockContext, triggerHandler } from "./helpers";

import gitCheckpoint from "../pi-extensions/git-checkpoint";

describe("git-checkpoint extension", () => {
  let pi: ReturnType<typeof createMockPI>;

  beforeEach(() => {
    vi.clearAllMocks();
    pi = createMockPI();
  });

  it("registers turn_start, tool_result, session_before_fork, and agent_end handlers", () => {
    gitCheckpoint(pi);

    expect(pi._handlers["turn_start"]).toBeDefined();
    expect(pi._handlers["tool_result"]).toBeDefined();
    expect(pi._handlers["session_before_fork"]).toBeDefined();
    expect(pi._handlers["agent_end"]).toBeDefined();
  });

  it("creates git stash on turn_start", async () => {
    vi.mocked(pi.exec).mockResolvedValue({ stdout: "abc123\n", stderr: "" });
    const ctx = createMockContext();
    gitCheckpoint(pi);

    await triggerHandler(pi, "turn_start", {}, ctx);

    expect(pi.exec).toHaveBeenCalledWith("git", ["stash", "create"]);
  });

  it("stores checkpoint with entry ID", async () => {
    vi.mocked(pi.exec).mockResolvedValue({ stdout: "abc123\n", stderr: "" });
    const ctx = createMockContext();
    ctx.sessionManager.getLeafEntry = vi.fn().mockReturnValue({ id: "entry-1" });
    gitCheckpoint(pi);

    // First, set the currentEntryId via tool_result
    await triggerHandler(pi, "tool_result", {}, ctx);
    // Then create checkpoint
    await triggerHandler(pi, "turn_start", {}, ctx);

    expect(pi.exec).toHaveBeenCalledWith("git", ["stash", "create"]);
  });

  it("prompts user on fork when checkpoint exists", async () => {
    vi.mocked(pi.exec).mockResolvedValue({ stdout: "abc123\n", stderr: "" });
    const ctx = createMockContext();
    ctx.ui.select = vi.fn().mockResolvedValue("Yes, restore code to that point");
    gitCheckpoint(pi);

    // Set entry ID and create checkpoint
    ctx.sessionManager.getLeafEntry = vi.fn().mockReturnValue({ id: "entry-1" });
    await triggerHandler(pi, "tool_result", {}, ctx);
    await triggerHandler(pi, "turn_start", {}, ctx);

    // Trigger fork for the same entry
    await triggerHandler(pi, "session_before_fork", { entryId: "entry-1" }, ctx);

    expect(ctx.ui.select).toHaveBeenCalled();
  });

  it("restores code when user selects Yes", async () => {
    vi.mocked(pi.exec).mockResolvedValue({ stdout: "abc123\n", stderr: "" });
    const ctx = createMockContext();
    ctx.ui.select = vi.fn().mockResolvedValue("Yes, restore code to that point");
    gitCheckpoint(pi);

    ctx.sessionManager.getLeafEntry = vi.fn().mockReturnValue({ id: "entry-1" });
    await triggerHandler(pi, "tool_result", {}, ctx);
    await triggerHandler(pi, "turn_start", {}, ctx);

    await triggerHandler(pi, "session_before_fork", { entryId: "entry-1" }, ctx);

    expect(pi.exec).toHaveBeenCalledWith("git", ["stash", "apply", "abc123"]);
    expect(ctx.ui.notify).toHaveBeenCalledWith("Code restored to checkpoint", "info");
  });

  it("does not restore code when user selects No", async () => {
    vi.mocked(pi.exec).mockResolvedValue({ stdout: "abc123\n", stderr: "" });
    const ctx = createMockContext();
    ctx.ui.select = vi.fn().mockResolvedValue("No, keep current code");
    gitCheckpoint(pi);

    ctx.sessionManager.getLeafEntry = vi.fn().mockReturnValue({ id: "entry-1" });
    await triggerHandler(pi, "tool_result", {}, ctx);
    await triggerHandler(pi, "turn_start", {}, ctx);

    vi.mocked(pi.exec).mockClear();
    await triggerHandler(pi, "session_before_fork", { entryId: "entry-1" }, ctx);

    // Should not call stash apply
    const stashApplyCalls = vi.mocked(pi.exec).mock.calls.filter(
      (call) => call[0] === "git" && (call[1] as string[]).includes("apply")
    );
    expect(stashApplyCalls).toHaveLength(0);
  });

  it("clears checkpoints on agent_end", async () => {
    vi.mocked(pi.exec).mockResolvedValue({ stdout: "abc123\n", stderr: "" });
    const ctx = createMockContext();
    gitCheckpoint(pi);

    ctx.sessionManager.getLeafEntry = vi.fn().mockReturnValue({ id: "entry-1" });
    await triggerHandler(pi, "tool_result", {}, ctx);
    await triggerHandler(pi, "turn_start", {}, ctx);
    await triggerHandler(pi, "agent_end", {}, ctx);

    // After agent_end, checkpoints should be cleared
    ctx.ui.select = vi.fn();
    await triggerHandler(pi, "session_before_fork", { entryId: "entry-1" }, ctx);
    expect(ctx.ui.select).not.toHaveBeenCalled();
  });
});
