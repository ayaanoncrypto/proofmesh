import { describe, expect, it } from "vitest";

describe("Arbitrum Sepolia deployment credentials", () => {
  it("reaches Arbitrum Sepolia and has a deployer key", async () => {
    const rpcUrl = process.env.ARBITRUM_SEPOLIA_RPC_URL;
    const privateKey = process.env.ARBITRUM_SEPOLIA_PRIVATE_KEY;
    expect(rpcUrl).toMatch(/^https?:\/\//);
    expect(privateKey).toMatch(/^0x[0-9a-fA-F]{64}$/);
    const response = await fetch(rpcUrl!, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
    });
    expect(response.ok).toBe(true);
    const payload = await response.json() as { result?: string };
    expect(payload.result?.toLowerCase()).toBe("0x66eee");
  }, 15_000);
});
