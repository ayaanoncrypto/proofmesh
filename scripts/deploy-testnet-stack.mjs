import fs from "node:fs";
import path from "node:path";
import solc from "solc";
import { ethers } from "ethers";

const rpcUrl = process.env.ARBITRUM_SEPOLIA_RPC_URL;
const privateKey = process.env.ARBITRUM_SEPOLIA_PRIVATE_KEY;
if (!rpcUrl || !privateKey) throw new Error("ARBITRUM_SEPOLIA_RPC_URL and ARBITRUM_SEPOLIA_PRIVATE_KEY are required");
if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) throw new Error("Invalid deployer private key format");

function compile() {
  const sources = {
    "TestUSDC.sol": { content: fs.readFileSync(path.resolve("contracts/TestUSDC.sol"), "utf8") },
    "MilestoneVault.sol": { content: fs.readFileSync(path.resolve("contracts/MilestoneVault.sol"), "utf8") },
  };
  const input = {
    language: "Solidity",
    sources,
    settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = output.errors ?? [];
  const fatal = errors.filter(error => error.severity === "error");
  if (fatal.length) throw new Error(fatal.map(error => error.formattedMessage).join("\n"));
  return {
    token: output.contracts["TestUSDC.sol"].TestUSDC,
    vault: output.contracts["MilestoneVault.sol"].MilestoneVault,
  };
}

const artifacts = compile();
const provider = new ethers.JsonRpcProvider(rpcUrl, 421614, { staticNetwork: true });
const network = await provider.getNetwork();
if (network.chainId !== 421614n) throw new Error(`Wrong network: ${network.chainId}`);
const signer = new ethers.Wallet(privateKey, provider);
const balance = await provider.getBalance(signer.address);
if (balance === 0n) throw new Error("Deployer has no Arbitrum Sepolia ETH for gas");
console.log(JSON.stringify({ deployer: signer.address, balanceWei: balance.toString(), chainId: network.chainId.toString() }));

const tokenFactory = new ethers.ContractFactory(artifacts.token.abi, artifacts.token.evm.bytecode.object, signer);
const token = await tokenFactory.deploy();
const tokenTx = token.deploymentTransaction();
await token.waitForDeployment();
const tokenAddress = await token.getAddress();

const vaultFactory = new ethers.ContractFactory(artifacts.vault.abi, artifacts.vault.evm.bytecode.object, signer);
const vault = await vaultFactory.deploy(tokenAddress);
const vaultTx = vault.deploymentTransaction();
await vault.waitForDeployment();
const vaultAddress = await vault.getAddress();

const deployment = {
  chainId: 421614,
  network: "Arbitrum Sepolia",
  deployer: signer.address,
  tokenAddress,
  tokenTransactionHash: tokenTx?.hash,
  vaultAddress,
  vaultTransactionHash: vaultTx?.hash,
  explorer: "https://sepolia.arbiscan.io",
};
fs.writeFileSync(path.resolve("contracts/TestUSDC.abi.json"), JSON.stringify(artifacts.token.abi, null, 2) + "\n");
fs.writeFileSync(path.resolve("contracts/MilestoneVault.abi.json"), JSON.stringify(artifacts.vault.abi, null, 2) + "\n");
fs.writeFileSync(path.resolve("contracts/testnet.deployment.json"), JSON.stringify(deployment, null, 2) + "\n");
console.log(JSON.stringify(deployment));
