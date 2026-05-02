"use client";

import { useState, useEffect, useCallback } from "react";
import { useWatchContractEvent, useChainId } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Lock, Zap } from "lucide-react";
import { clsx } from "clsx";
import { VEILDAO_ABI, getVeilDAOAddress } from "@/lib/contracts";

interface VoteEvent {
  id:        string;
  voter:     `0x${string}`;
  weight:    number;
  timestamp: number;
}

function formatAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function timeAgo(ts: number) {
  const s = Math.floor(Date.now() / 1000) - ts;
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

interface Props {
  proposalId: bigint;
  isDemoMode: boolean;
}

const DEMO_FEED: VoteEvent[] = [
  { id: "d1", voter: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", weight: 4, timestamp: Math.floor(Date.now() / 1000) - 45  },
  { id: "d2", voter: "0x1A2b3C4D5E6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B", weight: 1, timestamp: Math.floor(Date.now() / 1000) - 132 },
  { id: "d3", voter: "0xDeadBeefDeadBeefDeadBeefDeadBeefDeadBeef", weight: 2, timestamp: Math.floor(Date.now() / 1000) - 310 },
  { id: "d4", voter: "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12", weight: 1, timestamp: Math.floor(Date.now() / 1000) - 590 },
];

export function LiveVoteFeed({ proposalId, isDemoMode }: Props) {
  const chainId = useChainId();
  const address = getVeilDAOAddress(chainId ?? 0);
  const [events, setEvents] = useState<VoteEvent[]>(isDemoMode ? DEMO_FEED : []);
  const [, forceUpdate] = useState(0);

  // Tick every 30s to refresh relative timestamps
  useEffect(() => {
    const t = setInterval(() => forceUpdate(n => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const push = useCallback((e: VoteEvent) => {
    setEvents(prev => [e, ...prev].slice(0, 20));
  }, []);

  useWatchContractEvent({
    address,
    abi:       VEILDAO_ABI,
    eventName: "VoteCast",
    args:      { proposalId },
    enabled:   !!address && !isDemoMode,
    onLogs(logs) {
      logs.forEach(log => {
        const l = log as any;
        push({ id: log.transactionHash ?? Math.random().toString(), voter: l.args.voter, weight: 1, timestamp: Math.floor(Date.now() / 1000) });
      });
    },
  });

  useWatchContractEvent({
    address,
    abi:       VEILDAO_ABI,
    eventName: "WeightedVoteCast",
    args:      { proposalId },
    enabled:   !!address && !isDemoMode,
    onLogs(logs) {
      logs.forEach(log => {
        const l = log as any;
        push({ id: log.transactionHash ?? Math.random().toString(), voter: l.args.voter, weight: Number(l.args.weight), timestamp: Math.floor(Date.now() / 1000) });
      });
    },
  });

  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.06]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald" />
          <h3 className="text-sm font-semibold text-white">Live Vote Feed</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          direction hidden
        </div>
      </div>

      {/* Guarantee note */}
      <div className="flex items-center gap-1.5 mb-3 text-[11px] font-mono text-slate-600">
        <Lock className="w-3 h-3" />
        Address + weight visible · vote direction permanently encrypted
      </div>

      {/* Feed */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-6 font-mono">
              Waiting for votes…
            </p>
          ) : (
            events.map(ev => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0,  height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-center gap-2.5">
                  {/* Weight badge */}
                  <span className={clsx(
                    "flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border",
                    ev.weight === 1 ? "text-slate-400 border-slate-700 bg-slate-800/60"
                      : ev.weight === 2 ? "text-cyan border-cyan/30 bg-cyan/10"
                      : "text-violet-light border-violet/30 bg-violet/10"
                  )}>
                    {ev.weight > 1 && <Zap className="w-2.5 h-2.5" />}
                    {ev.weight}×
                  </span>
                  {/* Address */}
                  <span className="font-mono text-xs text-slate-400">{formatAddress(ev.voter)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Encrypted badge */}
                  <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet/8 border border-violet/20 text-violet-light">
                    <Lock className="w-2 h-2" />
                    ENC
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">{timeAgo(ev.timestamp)}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {isDemoMode && (
        <p className="mt-3 text-[10px] text-slate-700 text-center font-mono">
          demo data · connect wallet to see live events
        </p>
      )}
    </div>
  );
}
