"use client";

import { motion } from "framer-motion";
import { BarChart2, TrendingUp, Users2, Lock, Info, RefreshCw, GitBranch } from "lucide-react";
import { EncryptedCounter } from "@/components/EncryptedCounter";
import type { Proposal } from "@/lib/contracts";

interface Props {
  proposal:          Proposal;
  onCompute?:        () => void;
  isComputing?:      boolean;
  computeSuccess?:   boolean;
  analyticsAddress?: string;
}

export function FHEAnalyticsPanel({ proposal, onCompute, isComputing, analyticsAddress }: Props) {
  const { resolved, analyticsReady, analyticsPublished, margin, totalVotes } = proposal;

  if (!resolved) return null;

  // margin = FHE.sub(forVotes, againstVotes) — wraps on uint32 underflow.
  // Values > 2^31 mean AGAINST leads (two's complement).
  const TWO_31      = BigInt(2 ** 31);
  const forLeads    = margin <= TWO_31;
  const displayMargin = forLeads ? margin : BigInt(2 ** 32) - margin;

  const needsCompute = !analyticsPublished && !!onCompute;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="glass rounded-2xl p-6 border border-cyan/[0.14]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan" />
          <h2 className="text-sm font-semibold text-white">FHE Analytics</h2>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan/10 border border-cyan/20 text-cyan">
            GhostAnalytics.sol
          </span>
        </div>
        {!analyticsReady && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
            <Lock className="w-3 h-3" />
            oracle pending
          </div>
        )}
      </div>

      {/* Cross-contract note */}
      {analyticsAddress && (
        <div className="flex items-center gap-1.5 mb-4 text-[10px] font-mono text-slate-600">
          <GitBranch className="w-3 h-3" />
          <span className="text-slate-700">GhostGov</span>
          <span className="text-slate-600">→ FHE.allow() →</span>
          <span className="text-cyan/70">{analyticsAddress.slice(0, 8)}…</span>
        </div>
      )}
      {!analyticsAddress && <div className="mb-4" />}

      {/* Counters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <TrendingUp className="w-3.5 h-3.5" />
            Winning Margin
          </div>
          <EncryptedCounter
            value={analyticsReady ? displayMargin : 0n}
            revealed={analyticsReady}
            label={analyticsReady ? (forLeads ? "FOR leads" : "AGAINST leads") : "MARGIN"}
            color="violet"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users2 className="w-3.5 h-3.5" />
            Total Turnout
          </div>
          <EncryptedCounter
            value={analyticsReady ? totalVotes : 0n}
            revealed={analyticsReady}
            label="VOTES"
            color="amber"
          />
        </div>
      </div>

      {/* Compute trigger — shown when analytics engine is wired but not yet computed */}
      {needsCompute && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onCompute}
          disabled={isComputing}
          className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cyan/30 bg-cyan/8 text-cyan text-xs font-medium hover:bg-cyan/15 transition-all disabled:opacity-50"
        >
          {isComputing ? (
            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Computing on ciphertext…</>
          ) : (
            <><RefreshCw className="w-3.5 h-3.5" /> Trigger FHE analytics (GhostAnalytics.computeAnalytics)</>
          )}
        </motion.button>
      )}

      {/* Technical proof note */}
      <div className="p-3 rounded-xl bg-slate-900/50 border border-white/[0.04] text-[11px] text-slate-600 leading-relaxed font-mono flex gap-2">
        <Info className="w-3.5 h-3.5 text-cyan/50 flex-shrink-0 mt-0.5" />
        {analyticsReady ? (
          <span>
            Verified via <span className="text-cyan">FHE.publishDecryptResult</span> in GhostAnalytics.
            Computed on encrypted handles granted by <span className="text-violet-light">GhostGov.resolveProposal()</span>.
          </span>
        ) : (
          <span>
            <span className="text-cyan">FHE.sub(for, against)</span> → <span className="text-violet-light">encMargin</span>
            {" · "}
            <span className="text-cyan">FHE.add(for+against+abstain)</span> → <span className="text-violet-light">encTotalVotes</span>.
            Computed by GhostAnalytics on handles it was granted via FHE.allow().
          </span>
        )}
      </div>
    </motion.div>
  );
}
