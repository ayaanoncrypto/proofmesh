import { afterEach, describe, expect, it, vi } from "vitest";
import { arbiscanTxUrl, confirmContributionTransactions, confirmReleaseTransaction, ensureArbitrumSepolia, waitForTransaction } from "../client/src/lib/wallet";
import { MILESTONE_VAULT_CONFIG } from "../shared/contractConfig";

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
  vi.restoreAllMocks();
});

describe("ProofMesh wallet utilities", () => {
  it("builds Arbiscan Sepolia transaction links", () => {
    expect(arbiscanTxUrl("0xabc123")).toBe("https://sepolia.arbiscan.io/tx/0xabc123");
  });

  it("switches a connected wallet to Arbitrum Sepolia", async () => {
    const request = vi.fn().mockResolvedValue("0x1");
    (globalThis as { window?: unknown }).window = { ethereum: { request } };
    await ensureArbitrumSepolia();
    expect(request).toHaveBeenCalledWith({ method: "eth_chainId" });
    expect(request).toHaveBeenCalledWith({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x66eee" }] });
  });

  it("adds Arbitrum Sepolia when the wallet does not know the network", async () => {
    const request = vi.fn()
      .mockResolvedValueOnce("0x1")
      .mockRejectedValueOnce({ code: 4902 })
      .mockResolvedValueOnce(null);
    (globalThis as { window?: unknown }).window = { ethereum: { request } };
    await ensureArbitrumSepolia();
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ method: "wallet_addEthereumChain" }));
  });

  it("requires a mined transaction hash before reporting success", async () => {
    await expect(waitForTransaction({ wait: vi.fn().mockResolvedValue({ hash: "0xconfirmed" }) })).resolves.toEqual({ hash: "0xconfirmed" });
    await expect(waitForTransaction({ wait: vi.fn().mockResolvedValue({ hash: "" }) })).rejects.toThrow("not confirmed");
  });

  it("waits for approval before confirming a contribution", async () => {
    const order: string[] = [];
    const approval = { wait: vi.fn(async () => { order.push("approval"); return { hash: "0xapproval" }; }) };
    const submit = vi.fn(async () => { order.push("submit"); return { wait: vi.fn(async () => { order.push("contribution"); return { hash: "0xcontribution" }; }) }; });
    await expect(confirmContributionTransactions(approval, submit)).resolves.toEqual({ hash: "0xcontribution" });
    expect(order).toEqual(["approval", "submit", "contribution"]);
  });

  it("confirms a release only when the receipt includes a hash", async () => {
    await expect(confirmReleaseTransaction({ wait: vi.fn().mockResolvedValue({ hash: "0xrelease" }) })).resolves.toEqual({ hash: "0xrelease" });
    await expect(confirmReleaseTransaction({ wait: vi.fn().mockResolvedValue({ hash: "" }) })).rejects.toThrow("not confirmed");
  });

  it("uses the deployed pUSDC token on Arbitrum Sepolia", () => {
    expect(MILESTONE_VAULT_CONFIG.chainId).toBe(421614);
    expect(MILESTONE_VAULT_CONFIG.tokenDecimals).toBe(6);
    expect(MILESTONE_VAULT_CONFIG.tokenAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(MILESTONE_VAULT_CONFIG.tokenAbi.some(item => item.name === "faucet")).toBe(true);
  });
});
