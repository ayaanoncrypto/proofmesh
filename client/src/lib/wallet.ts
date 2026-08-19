import { BrowserProvider, Contract, JsonRpcSigner, parseUnits, formatUnits } from "ethers";
import { MILESTONE_VAULT_CONFIG } from "@shared/contractConfig";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export type WalletSnapshot = {
  address: string;
  chainId: number;
  nativeBalanceEth: string;
  tokenBalance: string;
};

const ARBITRUM_SEPOLIA_PARAMS = {
  chainId: "0x66eee",
  chainName: "Arbitrum Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
  blockExplorerUrls: [MILESTONE_VAULT_CONFIG.explorerBaseUrl],
};

function requireEthereum() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Install a browser wallet such as MetaMask to use Arbitrum Sepolia.");
  }
  return window.ethereum;
}

export async function ensureArbitrumSepolia() {
  const ethereum = requireEthereum();
  const current = await ethereum.request({ method: "eth_chainId" });
  if (String(current).toLowerCase() !== ARBITRUM_SEPOLIA_PARAMS.chainId.toLowerCase()) {
    try {
      await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ARBITRUM_SEPOLIA_PARAMS.chainId }] });
    } catch (error: unknown) {
      const code = typeof error === "object" && error && "code" in error ? (error as { code?: number }).code : undefined;
      if (code !== 4902) throw error;
      await ethereum.request({ method: "wallet_addEthereumChain", params: [ARBITRUM_SEPOLIA_PARAMS] });
    }
  }
}

async function providerAndSigner() {
  const ethereum = requireEthereum();
  await ensureArbitrumSepolia();
  const provider = new BrowserProvider(ethereum as never);
  const signer = await provider.getSigner();
  return { provider, signer };
}

export async function connectWallet(): Promise<WalletSnapshot> {
  const ethereum = requireEthereum();
  await ensureArbitrumSepolia();
  await ethereum.request({ method: "eth_requestAccounts" });
  const { provider, signer } = await providerAndSigner();
  return readWallet(provider, signer);
}

export async function readConnectedWallet(): Promise<WalletSnapshot | null> {
  if (typeof window === "undefined" || !window.ethereum) return null;
  const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as string[];
  if (!accounts.length) return null;
  const { provider, signer } = await providerAndSigner();
  return readWallet(provider, signer);
}

async function readWallet(provider: BrowserProvider, signer: JsonRpcSigner): Promise<WalletSnapshot> {
  const network = await provider.getNetwork();
  const address = await signer.getAddress();
  const nativeBalance = await provider.getBalance(address);
  const token = new Contract(MILESTONE_VAULT_CONFIG.tokenAddress, MILESTONE_VAULT_CONFIG.tokenAbi, provider);
  const tokenBalance = await token.balanceOf(address);
  return {
    address,
    chainId: Number(network.chainId),
    nativeBalanceEth: Number(formatUnits(nativeBalance, 18)).toFixed(4),
    tokenBalance: formatUnits(tokenBalance, MILESTONE_VAULT_CONFIG.tokenDecimals),
  };
}

async function getContracts() {
  const { signer } = await providerAndSigner();
  const vault = new Contract(MILESTONE_VAULT_CONFIG.deploymentAddress, MILESTONE_VAULT_CONFIG.abi, signer);
  const token = new Contract(MILESTONE_VAULT_CONFIG.tokenAddress, MILESTONE_VAULT_CONFIG.tokenAbi, signer);
  return { vault, token };
}

export type ConfirmedTransaction = { hash: string };

export async function waitForTransaction<T extends ConfirmedTransaction>(tx: { wait: () => Promise<T> }) {
  const receipt = await tx.wait();
  if (!receipt?.hash) throw new Error("Transaction was not confirmed by the network.");
  return receipt;
}

export async function confirmContributionTransactions<Approval extends ConfirmedTransaction, Contribution extends ConfirmedTransaction>(approval: { wait: () => Promise<Approval> }, submitContribution: () => Promise<{ wait: () => Promise<Contribution> }>) {
  await waitForTransaction(approval);
  return waitForTransaction(await submitContribution());
}

export async function confirmReleaseTransaction<Release extends ConfirmedTransaction>(release: { wait: () => Promise<Release> }) {
  return waitForTransaction(release);
}

export async function requestTestUsdc() {
  const { token } = await getContracts();
  const tx = await token.faucet();
  return waitForTransaction(tx);
}

export async function createOnchainProject(projectId: number, milestoneAmountsUsdc: number[]) {
  const { vault } = await getContracts();
  const amounts = milestoneAmountsUsdc.map(amount => parseUnits(String(amount), MILESTONE_VAULT_CONFIG.tokenDecimals));
  const tx = await vault.createProject(projectId, amounts);
  return waitForTransaction(tx);
}

export async function contributeOnchain(projectId: number, amountUsdc: number) {
  const { vault, token } = await getContracts();
  const amount = parseUnits(String(amountUsdc), MILESTONE_VAULT_CONFIG.tokenDecimals);
  const approval = await token.approve(MILESTONE_VAULT_CONFIG.deploymentAddress, amount);
  return confirmContributionTransactions(approval, () => vault.contribute(projectId, amount));
}

export async function releaseOnchain(projectId: number, milestoneIndex: number) {
  const { vault } = await getContracts();
  const tx = await vault.releaseMilestone(projectId, milestoneIndex);
  return confirmReleaseTransaction(tx);
}

export function arbiscanTxUrl(hash: string) {
  return `${MILESTONE_VAULT_CONFIG.explorerBaseUrl}/tx/${hash}`;
}
