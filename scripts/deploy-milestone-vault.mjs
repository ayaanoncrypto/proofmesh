import fs from "node:fs";
import path from "node:path";
import solc from "solc";
import { ethers } from "ethers";

const rpcUrl = process.env.ARBITRUM_SEPOLIA_RPC_URL;
const privateKey = process.env.ARBITRUM_SEPOLIA_PRIVATE_KEY;
if (!rpcUrl || !privateKey) throw new Error("ARBITRUM_SEPOLIA_RPC_URL and ARBITRUM_SEPOLIA_PRIVATE_KEY are required");
if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) throw new Error("Invalid deployer private key format");

const sourcePath = path.resolve("contracts/MilestoneVault.sol");
const source = fs.readFileSync(sourcePath, "utf8");
const input = {
  language: "Solidity",
  sources: { "MilestoneVault.sol": { content: source } },
  settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));
const errors = output.errors ?? [];
const fatal = errors.filter(error => error.severity === "error");
if (fatal.length) throw new Error(fatal.map(error => error.formattedMessage).join("\n"));
const artifact = output.contracts["MilestoneVault.sol"].MilestoneVault;
const provider = new ethers.JsonRpcProvider(rpcUrl, 421614, { staticNetwork: true });
const network = await provider.getNetwork();
if (network.chainId !== 421614n) throw new Error(`Wrong network: ${network.chainId}`);
const signer = new ethers.Wallet(privateKey, provider);
const balance = await provider.getBalance(signer.address);
console.log(JSON.stringify({ deployer: signer.address, balanceWei: balance.toString(), chainId: network.chainId.toString() }));
if (balance === 0n) throw new Error("Deployer has no Arbitrum Sepolia ETH for gas");
const factory = new ethers.ContractFactory(artifact.abi, artifact.evm.bytecode.object, signer);
const contract = await factory.deploy();
const deploymentTx = contract.deploymentTransaction();
console.log(JSON.stringify({ deploymentTx: deploymentTx?.hash }));
await contract.waitForDeployment();
const address = await contract.getAddress();
console.log(JSON.stringify({ address, deploymentTx: deploymentTx?.hash, chainId: network.chainId.toString() }));
fs.writeFileSync(path.resolve("contracts/MilestoneVault.abi.json"), JSON.stringify(artifact.abi, null, 2) + "\n");
fs.writeFileSync(path.resolve("contracts/MilestoneVault.deployment.json"), JSON.stringify({ address, chainId: Number(network.chainId), network: "Arbitrum Sepolia", deployer: signer.address, transactionHash: deploymentTx?.hash }, null, 2) + "\n");
