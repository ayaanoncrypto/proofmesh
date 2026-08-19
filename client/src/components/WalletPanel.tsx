import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, ExternalLink, WalletCards } from "lucide-react";
import type { WalletSnapshot } from "@/lib/wallet";

export function WalletPanel({ wallet, busy, onConnect, onFaucet }: { wallet: WalletSnapshot | null; busy: boolean; onConnect: () => void; onFaucet: () => void }) {
  return (
    <Card className="border-cyan-200 bg-cyan-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between font-mono text-xs uppercase tracking-[.14em]">
          <span className="flex items-center gap-2"><WalletCards size={16} className="text-cyan-600" /> Testnet wallet</span>
          <span className={wallet?.chainId === 421614 ? "text-emerald-600" : "text-rose-600"}>{wallet?.chainId === 421614 ? "Arbitrum Sepolia" : "Connect wallet"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!wallet ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-slate-600">Connect a browser wallet to fund projects with testnet pUSDC and view your transaction records.</p><div className="rounded-xl border border-cyan-100 bg-white/70 p-3 text-xs leading-relaxed text-slate-500">Testnet only. Keep real funds out of this wallet. ProofMesh switches to Arbitrum Sepolia and asks for an ERC-20 approval before funding. If a transaction fails, check the network, ETH for gas, and your pUSDC balance before retrying.</div>
            <Button onClick={onConnect} disabled={busy} className="w-full rounded-full bg-[#101820] text-white">{busy ? "Connecting…" : "Connect wallet"}</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-800">Connected to Arbitrum Sepolia. All balances and transactions below use testnet assets.</div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 font-mono text-xs"><span className="truncate">{wallet.address}</span><a href={`https://sepolia.arbiscan.io/address/${wallet.address}`} target="_blank" rel="noreferrer" aria-label="Open wallet on Arbiscan"><ExternalLink size={13} /></a></div>
            <div className="grid grid-cols-2 gap-2 text-sm"><div className="rounded-xl bg-white p-3"><div className="font-mono text-[10px] uppercase text-slate-400">pUSDC</div><div className="mt-1 font-semibold">{Number(wallet.tokenBalance).toLocaleString()}</div></div><div className="rounded-xl bg-white p-3"><div className="font-mono text-[10px] uppercase text-slate-400">Gas ETH</div><div className="mt-1 font-semibold">{wallet.nativeBalanceEth}</div></div></div>
            <Button onClick={onFaucet} disabled={busy} variant="outline" className="w-full rounded-full border-cyan-300 bg-white"><Droplets size={15} /> {busy ? "Waiting for wallet…" : "Request 10,000 test pUSDC"}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
