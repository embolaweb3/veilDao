"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Minus, Lock, CheckCircle, AlertCircle, Loader2, ShieldCheck, Zap } from "lucide-react";
import { clsx } from "clsx";
import type { VoteChoice, VoteWeight } from "@/lib/contracts";
import { WEIGHT_COSTS } from "@/lib/contracts";

interface Props {
  proposalId: bigint;
  hasVoted:   boolean;
  isActive:   boolean;
  onVote:     (choice: VoteChoice, weight: VoteWeight) => Promise<void>;
  stage:      "idle" | "encrypting" | "sending" | "confirming" | "success" | "error";
  errMsg:     string;
}

const CHOICES: {
  id: VoteChoice; label: string; icon: typeof ThumbsUp;
  color: string; hoverBg: string; activeBg: string; activeText: string; borderColor: string;
}[] = [
  { id: "for",     label: "FOR",     icon: ThumbsUp,   color: "text-emerald",   hoverBg: "hover:bg-emerald/10 hover:border-emerald/50", activeBg: "bg-emerald/15", activeText: "text-emerald",   borderColor: "border-emerald/60" },
  { id: "against", label: "AGAINST", icon: ThumbsDown, color: "text-rose",      hoverBg: "hover:bg-rose/10 hover:border-rose/50",       activeBg: "bg-rose/15",    activeText: "text-rose",      borderColor: "border-rose/60"    },
  { id: "abstain", label: "ABSTAIN", icon: Minus,       color: "text-amber-400", hoverBg: "hover:bg-amber/10 hover:border-amber/50",     activeBg: "bg-amber/15",   activeText: "text-amber-400", borderColor: "border-amber/60"   },
];

const WEIGHTS: { value: VoteWeight; label: string; desc: string }[] = [
  { value: 1, label: "1×", desc: "Free"      },
  { value: 2, label: "2×", desc: "0.0004 ETH" },
  { value: 4, label: "4×", desc: "0.0016 ETH" },
];

const STAGE_MESSAGES: Record<string, string> = {
  encrypting: "Encrypting vote with FHE…",
  sending:    "Sending to blockchain…",
  confirming: "Confirming transaction…",
};

export function VotePanel({ proposalId, hasVoted, isActive, onVote, stage, errMsg }: Props) {
  const [selected, setSelected] = useState<VoteChoice | null>(null);
  const [weight,   setWeight]   = useState<VoteWeight>(1);
  const [showEncryptAnim, setShowEncryptAnim] = useState(false);

  const handleSelect = useCallback((choice: VoteChoice) => {
    if (stage !== "idle" || hasVoted || !isActive) return;
    setSelected(choice);
  }, [stage, hasVoted, isActive]);

  const handleWeightSelect = useCallback((w: VoteWeight) => {
    if (stage !== "idle" || hasVoted || !isActive) return;
    setWeight(w);
  }, [stage, hasVoted, isActive]);

  const handleSubmit = useCallback(async () => {
    if (!selected || stage !== "idle") return;
    setShowEncryptAnim(true);
    setTimeout(() => setShowEncryptAnim(false), 800);
    await onVote(selected, weight);
  }, [selected, weight, stage, onVote]);

  if (!isActive) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/[0.06] text-center">
        <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Voting period has ended</p>
      </div>
    );
  }

  if (hasVoted || stage === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-6 border border-emerald/20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
          className="w-14 h-14 rounded-full bg-emerald/10 border border-emerald/30 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-7 h-7 text-emerald" />
        </motion.div>
        <h3 className="text-white font-semibold mb-1">Vote Encrypted & Submitted</h3>
        <p className="text-slate-400 text-sm mb-4">
          Your encrypted ballot is permanently on-chain. Nobody — not even the contract — can link this vote to your address.
        </p>
        <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet/10 border border-violet/20 text-xs font-mono text-violet-light">
          <ShieldCheck className="w-3.5 h-3.5" />
          Coercion-resistance guaranteed by FHE
        </div>
      </motion.div>
    );
  }

  const isBusy = stage !== "idle" && stage !== "error";
  const cost   = WEIGHT_COSTS[weight];

  return (
    <div className="glass rounded-2xl p-6 border border-white/[0.06] relative">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-violet-light" />
        <h3 className="text-sm font-semibold text-white">Cast Your Encrypted Vote</h3>
      </div>

      {/* FHE guarantee banner */}
      <div className="mb-4 px-3 py-2.5 rounded-lg bg-violet/8 border border-violet/15 text-xs text-slate-400 leading-relaxed">
        <span className="text-violet-light font-medium">How it works: </span>
        Encrypted in your browser before hitting the network. The contract tallies on ciphertexts — your direction is permanently unreadable.
      </div>

      {/* Direction buttons */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {CHOICES.map(({ id, label, icon: Icon, hoverBg, activeBg, activeText, borderColor }) => {
          const isSelected = selected === id;
          return (
            <motion.button
              key={id}
              onClick={() => handleSelect(id)}
              disabled={isBusy}
              whileHover={!isBusy ? { y: -2 } : {}}
              whileTap={!isBusy ? { scale: 0.97 } : {}}
              className={clsx(
                "relative flex flex-col items-center gap-2 py-4 px-2 rounded-xl border transition-all duration-200 font-mono text-xs font-semibold",
                isSelected
                  ? [activeBg, activeText, borderColor, "shadow-lg"]
                  : ["bg-white/[0.02] border-white/[0.06] text-slate-500", hoverBg],
                isBusy && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon className={clsx("w-5 h-5", isSelected ? activeText : "text-slate-600")} />
              {label}
              {isSelected && (
                <motion.div
                  layoutId="vote-selection"
                  className="absolute inset-0 rounded-xl border-2 border-current opacity-30"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Quadratic weight selector */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2 text-xs text-slate-500">
          <Zap className="w-3 h-3" />
          Vote weight <span className="text-slate-600">(quadratic cost)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {WEIGHTS.map(({ value: w, label, desc }) => (
            <button
              key={w}
              onClick={() => handleWeightSelect(w)}
              disabled={isBusy}
              className={clsx(
                "flex flex-col items-center py-2.5 px-1 rounded-xl border text-xs transition-all",
                weight === w
                  ? "bg-cyan/10 border-cyan/40 text-cyan"
                  : "bg-white/[0.02] border-white/[0.06] text-slate-500 hover:border-white/20 hover:text-slate-300",
                isBusy && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="font-mono font-bold text-sm">{label}</span>
              <span className="text-[10px] mt-0.5 opacity-70">{desc}</span>
            </button>
          ))}
        </div>
        {weight > 1 && (
          <p className="mt-1.5 text-[10px] text-slate-600 font-mono">
            Direction stays hidden — only weight is revealed via payment value.
          </p>
        )}
      </div>

      {/* Encrypt animation overlay */}
      <AnimatePresence>
        {showEncryptAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl bg-violet/10 flex items-center justify-center z-10"
          >
            <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 0.8 }}>
              <Lock className="w-10 h-10 text-violet-light" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage / error message */}
      <AnimatePresence mode="wait">
        {isBusy && (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mb-3 flex items-center gap-2 text-xs text-violet-light font-mono"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {STAGE_MESSAGES[stage]}
          </motion.div>
        )}
        {stage === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center gap-2 text-xs text-rose font-mono"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {errMsg || "Transaction failed"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        onClick={handleSubmit}
        disabled={!selected || isBusy}
        whileHover={selected && !isBusy ? { scale: 1.02 } : {}}
        whileTap={selected && !isBusy ? { scale: 0.98 } : {}}
        className={clsx(
          "w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200",
          selected && !isBusy
            ? "bg-violet text-white glow-violet cursor-pointer"
            : "bg-white/5 text-slate-600 cursor-not-allowed"
        )}
      >
        {isBusy ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            {cost > 0n
              ? `Encrypt & Submit (${weight === 2 ? "0.0004" : "0.0016"} ETH)`
              : "Encrypt & Submit Vote"}
          </span>
        )}
      </motion.button>
    </div>
  );
}
