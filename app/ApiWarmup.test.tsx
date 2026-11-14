import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ApiWarmup from "./ApiWarmup";
import { warmupAPI } from "@/app/lib/api";

vi.mock("@/app/lib/api", () => ({
  warmupAPI: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ApiWarmup", () => {
  it("warms the API when the root layout mounts", () => {
    render(<ApiWarmup />);

    expect(warmupAPI).toHaveBeenCalledOnce();
  });
});
