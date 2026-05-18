import { vi } from "vitest";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

export interface MockExtensionAPI extends ExtensionAPI {
  _handlers: Record<string, Function[]>;
  _tools: Record<string, any>;
  _commands: Record<string, any>;
  execMock: ReturnType<typeof vi.fn>;
}

export function createMockPI(): MockExtensionAPI {
  const handlers: Record<string, Function[]> = {};
  const tools: Record<string, any> = {};
  const commands: Record<string, any> = {};

  const pi = {
    _handlers: handlers,
    _tools: tools,
    _commands: commands,
    execMock: vi.fn().mockResolvedValue({ stdout: "", stderr: "" }),

    on: vi.fn((event: string, handler: Function) => {
      if (!handlers[event]) handlers[event] = [];
      handlers[event].push(handler);
    }),

    registerTool: vi.fn((tool: any) => {
      tools[tool.name] = tool;
    }),

    registerCommand: vi.fn((name: string, cmd: any) => {
      commands[name] = cmd;
    }),

    exec: vi.fn().mockResolvedValue({ stdout: "", stderr: "" }),

    getSessionName: vi.fn().mockReturnValue(undefined),

    sendMessage: vi.fn(),
    sendUserMessage: vi.fn(),
    appendEntry: vi.fn(),
    setSessionName: vi.fn(),
    getFlag: vi.fn().mockReturnValue(false),
  } as unknown as MockExtensionAPI;

  return pi;
}

export function createMockContext(overrides?: Partial<ExtensionContext>): ExtensionContext {
  return {
    hasUI: true,
    cwd: "/test/dir",
    ui: {
      notify: vi.fn(),
      setTitle: vi.fn(),
      setStatus: vi.fn(),
      setWidget: vi.fn(),
      setWorkingMessage: vi.fn(),
      select: vi.fn().mockResolvedValue(null),
      confirm: vi.fn().mockResolvedValue(true),
      input: vi.fn().mockResolvedValue(""),
      custom: vi.fn().mockResolvedValue({}),
    },
    sessionManager: {
      getEntries: vi.fn().mockReturnValue([]),
      getLeafEntry: vi.fn().mockReturnValue(null),
      getLeafId: vi.fn().mockReturnValue(undefined),
      getSessionFile: vi.fn().mockReturnValue(undefined),
    },
    signal: undefined,
    ...overrides,
  } as ExtensionContext;
}

export function triggerHandler(
  pi: MockExtensionAPI,
  event: string,
  eventData?: any,
  ctx?: ExtensionContext
) {
  const handlers = pi._handlers[event] || [];
  const mockCtx = ctx || createMockContext();
  return Promise.all(handlers.map((h) => h(eventData || {}, mockCtx)));
}
