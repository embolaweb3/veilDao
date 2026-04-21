"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users, ChevronRight, Lock, Unlock, Tag } from "lucide-react";
import { clsx } from "clsx";
import { EncryptedCounter } from "./EncryptedCounter";
import type { Proposal } from "@/lib/contracts";

interface Props {
  proposal: Proposal;
  index?:   number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Security:  "bg-rose/10    text-rose-400   border-rose/20",
  Treasury:  "bg-amber/10   text-amber-400  border-amber/20",
  Community: "bg-cyan/10    text-cyan        border-cyan/20",
  Protocol:  "bg-violet/10  text-violet-light border-violet/20",
  Other:     "bg-slate-800  text-slate-400  border-slate-700",
};

function formatTimeLeft(endTime: bigint): { text: string; isExpired: boolean } {
  const now    = BigInt(Math.floor(Date.now() / 1000));
  const diff   = endTime - now;
  const isExpired = diff <= 0n;

  if (isExpired) return { text: "Ended", isExpired: true };

  const secs  = Number(diff);
  const days  = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  const mins  = Math.floor((secs % 3600) / 60);

  if (days > 0)  return { text: `${days}d ${hours}h left`,  isExpired: false };
  if (hours > 0) return { text: `${hours}h ${mins}m left`,  isExpired: false };
  return             { text: `${mins}m left`,               isExpired: false };
}

export function ProposalCard({ proposal, index = 0 }: Props) {
  const { text: timeText, isExpired } = formatTimeLeft(proposal.endTime);
  const isLive    = !isExpired && !proposal.resolved;
  const hasResults = proposal.resultsReady;

  const totalVotes = hasResults
    ? Number(proposal.forVotes + proposal.againstVotes + proposal.abstainVotes)
    : 0;
  const forPct = totalVotes > 0 ? Math.round(Number(proposal.forVotes) / totalVotes * 100) : 0;

  const catColor = CATEGORY_COLORS[proposal.category] ?? CATEGORY_COLORS.Other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link href={`/vote/${proposal.id}`}>
        <div className="glass glass-hover gradient-border rounded-2xl p-5 cursor-pointer relative overflow-hidden">
          {/* Live pulse indicator */}
          {isLive && (
            <span className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              LIVE
            </span>
          )}
          {proposal.resolved && !hasResults && (
            <span className="absolute top-4 right-4 text-[10px] text-slate-500 font-mono px-2 py-1 rounded-full bg-slate-800/50 border border-slate-700">
              RESOLVING
            </span>
          )}
          {hasResults && (
            <span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] text-violet-light font-mono px-2 py-1 rounded-full bg-violet/10 border border-violet/20">
              <Unlock className="w-2.5 h-2.5" />
              REVEALED
            </span>
          )}

          {/* Category */}
          <div className="flex items-center gap-2 mb-3">
            <span className={clsx("flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider", catColor)}>
              <Tag className="w-2.5 h-2.5" />
              {proposal.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 pr-16 leading-snug">
            {proposal.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
            {proposal.description}
          </p>

          {/* Vote counts */}
          {hasResults ? (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <EncryptedCounter value={proposal.forVotes}     revealed label="FOR"     color="violet" />
              <EncryptedCounter value={proposal.againstVotes} revealed label="AGAINST" color="rose"   />
              <EncryptedCounter value={proposal.abstainVotes} revealed label="ABSTAIN" color="amber"  />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <EncryptedCounter value={0n} revealed={false} label="FOR"     color="violet" />
              <EncryptedCounter value={0n} revealed={false} label="AGAINST" color="rose"   />
              <EncryptedCounter value={0n} revealed={false} label="ABSTAIN" color="amber"  />
            </div>
          )}

          {/* Win bar */}
          {hasResults && totalVotes > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>FOR {forPct}%</span>
                <span>AGAINST {100 - forPct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${forPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={clsx("h-full rounded-full", forPct >= 50 ? "bg-emerald" : "bg-rose")}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {Number(proposal.voterCount)} voters
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeText}
              </span>
            </div>
            {!isLive && !hasResults && (
              <span className="flex items-center gap-1 text-slate-600">
                <Lock className="w-3 h-3" />
                encrypted
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-light transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
