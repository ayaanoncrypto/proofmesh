import { afterEach, describe, expect, it, vi } from "vitest";

const { calls } = vi.hoisted(() => ({ calls: [] as string[] }));

vi.mock("ethers", () => ({
  BrowserProvider: class {
    async getNetwork() { return { chainId: 421614n }; }
    async getSigner() { return { getAddress: async () => "0x1111111111111111111111111111111111111111" }; }
    async getBalance() { return 0n; }
  },
  Contract: class {
    async approve() { calls.push("approve"); return { wait: async () => { calls.push("approval-confirmed"); return { hash: "0xapproval" }; } }; }
    async contribute() { calls.push("contribute"); return { wait: async () => { calls.push("contribution-confirmed"); return { hash: "0xcontribution" }; } }; }
    async releaseMilestone() { calls.push("release"); return { wait: async () => { calls.push("release-confirmed"); return { hash: "0xrelease" }; } }; }
    async balanceOf() { return 0n; }
  },
  JsonRpcSigner: class {},
  formatUnits: () => "0",
  parseUnits: (value: string) => BigInt(value),
}));

import { contributeOnchain, releaseOnchain } from "../client/src/lib/wallet";

afterEach(() => {
  calls.length = 0;
  delete (globalThis as { window?: unknown }).window;
});

describe("ProofMesh onchain wallet helpers", () => {
  it("confirms ERC-20 approval before recording a contribution", async () => {
    (globalThis as { window?: unknown }).window = { ethereum: { request: vi.fn().mockResolvedValue("0x66eee") } };
    await expect(contributeOnchain(7, 250)).resolves.toEqual({ hash: "0xcontribution" });
    expect(calls).toEqual(["approve", "approval-confirmed", "contribute", "contribution-confirmed"]);
  });

  it("confirms a milestone release and returns its mined hash", async () => {
    (globalThis as { window?: unknown }).window = { ethereum: { request: vi.fn().mockResolvedValue("0x66eee") } };
    await expect(releaseOnchain(7, 1)).resolves.toEqual({ hash: "0xrelease" });
    expect(calls).toEqual(["release", "release-confirmed"]);
  });
});
