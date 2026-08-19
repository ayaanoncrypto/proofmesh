import { ethers } from "ethers";
import deployment from "../contracts/MilestoneVault.deployment.json" with { type: "json" };

const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_SEPOLIA_RPC_URL, 421614, { staticNetwork: true });
const network = await provider.getNetwork();
const code = await provider.getCode(deployment.address);
const receipt = await provider.getTransactionReceipt(deployment.transactionHash);
if (network.chainId !== 421614n) throw new Error(`Wrong chain: ${network.chainId}`);
if (code === "0x") throw new Error("No contract bytecode found at deployment address");
if (!receipt || receipt.status !== 1) throw new Error("Deployment transaction is not confirmed successfully");
console.log(JSON.stringify({ address: deployment.address, chainId: network.chainId.toString(), bytecodeBytes: (code.length - 2) / 2, blockNumber: receipt.blockNumber, transactionHash: deployment.transactionHash }));
