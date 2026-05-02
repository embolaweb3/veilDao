"use client";

import { motion } from "framer-motion";
import { BarChart2, TrendingUp, Users2, Lock, Info } from "lucide-react";
import { EncryptedCounter } from "@/components/EncryptedCounter";
import type { Proposal } from "@/lib/contracts";

interface Props {
  proposal: Proposal;
}

export function FHEAnalyticsPanel({ proposal }: Props) {
  const { resolved, analyticsReady, margin, totalVotes } = proposal;

  if (!resolved) return null;

  // margin = FHE.sub(forVotes, againstVotes) — wraps on underflow (uint32).
  // Values > 2^31 mean AGAINST leads (two's complement interpretation).
  const TWO_31 = BigInt(2 ** 31);
  const forLeads    = margin <= TWO_31;
  const displayMargin = forLeads ? margin : BigInt(2 ** 32) - margin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="glass rounded-2xl p-6 border border-cyan/[0.14]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan" />
          <h2 className="text-sm font-semibold text-white">FHE Analytics</h2>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan/10 border border-cyan/20 text-cyan">
            on-chain computed
          </span>
        </div>
        {!analyticsReady && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
            <Lock className="w-3 h-3" />
            oracle pending
          </div>
        )}
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Margin */}
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

        {/* Total turnout */}
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

      {/* Technical proof note */}
      <div className="p-3 rounded-xl bg-slate-900/50 border border-white/[0.04] text-[11px] text-slate-600 leading-relaxed font-mono flex gap-2">
        <Info className="w-3.5 h-3.5 text-cyan/50 flex-shrink-0 mt-0.5" />
        {analyticsReady ? (
          <span>
            Verified via{" "}
            <span className="text-cyan">FHE.publishDecryptResult</span> — margin and
            turnout were computed entirely on encrypted tallies. The EVM never saw plaintext.
          </span>
        ) : (
          <span>
            <span className="text-cyan">FHE.sub(for, against)</span> →{" "}
            <span className="text-violet-light">encMargin</span> ·{" "}
            <span className="text-cyan">FHE.add(for+against+abstain)</span> →{" "}
            <span className="text-violet-light">encTotalVotes</span>. Oracle decryption pending.
          </span>
        )}
      </div>
    </motion.div>
  );
}
