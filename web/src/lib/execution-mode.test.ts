import { describe, expect, it } from "vitest";
import { resolveAutoExecution } from "./execution-mode";

describe("resolveAutoExecution", () => {
  it("should route to the deep cluster pipeline when analysis level is deep", () => {
    expect(resolveAutoExecution({ level: "deep", mode: "deep", agentCount: 8 })).toEqual({
      kind: "deep",
      mode: "deep",
      agentCount: 8,
    });
  });

  it("should avoid collaboration mode when analysis mode is deep", () => {
    const execution = resolveAutoExecution({
      level: "complex",
      mode: "deep",
      agentCount: 8,
    });

    expect(execution.kind).toBe("deep");
  });

  it("should use a supported collaboration mode when analysis level is medium", () => {
    expect(resolveAutoExecution({ level: "medium", mode: "parallel", agentCount: 3 })).toEqual({
      kind: "collaboration",
      mode: "parallel",
      agentCount: 3,
    });
  });
});
