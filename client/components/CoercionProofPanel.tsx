"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Copy, Check, ChevronDown, Eye, EyeOff } from "lucide-react";
import { clsx } from "clsx";
import type { VoteChoice } from "@/lib/contracts";

// ── helpers ────────────────────────────────────────────────────────────────

const HEX = "0123456789abcdef";
const rand = (n: number) =>
  "0x" + Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join("");

function useScramble(target: string, frozen: boolean) {
  const [display, setDisplay] = useState(target.slice(0, 10) + "…");
  useEffect(() => {
    if (frozen) { setDisplay(target); return; }
    const iv = setInterval(() => {
      setDisplay("0x" + Array.from({ length: 62 }, () => HEX[Math.floor(Math.random() * 16)]).join("") + "…");
    }, 90);
    return () => clearInterval(iv);
  }, [frozen, target]);
  return display;
}

// ── constants ──────────────────────────────────────────────────────────────

const LABEL: Record<VoteChoice, string> = { for: "FOR", against: "AGAINST", abstain: "ABSTAIN" };
const COLOR: Record<VoteChoice, string> = {
  for:     "text-emerald  bg-emerald/10  border-emerald/25",
  against: "text-rose     bg-rose/10     border-rose/25",
  abstain: "text-amber-400 bg-amber-400/10 border-amber-400/25",
};
const OPPOSITE: Record<VoteChoice, VoteChoice> = { for: "against", against: "for", abstain: "for" };

// ── sub-component: one ciphertext row ─────────────────────────────────────

function CtRow({
  label, badge, badgeClass, ctHex, frozen, dim,
}: {
  label: string; badge: string; badgeClass: string;
  ctHex: string; frozen: boolean; dim?: boolean;
}) {
  const display = useScramble(ctHex, frozen);
  return (
    <div className={clsx("rounded-xl border p-3.5 transition-opacity", dim ? "border-white/[0.05] opacity-50" : "border-white/[0.08]")}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={clsx("text-xs font-mono px-2 py-0.5 rounded-full border", badgeClass)}>{badge}</span>
      </div>
      <p className="font-mono text-[11px] text-slate-600 break-all leading-snug">{display}</p>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────

interface Props { votedFor: VoteChoice }

export function CoercionProofPanel({ votedFor }: Props) {
  const realCt  = useRef(rand(64)).current;
  const fakeCt  = useRef(rand(64)).current;

  const [revealed,  setRevealed]  = useState(false);
  const [showProof, setShowProof] = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [expanded,  setExpanded]  = useState(false);

  const opposite = OPPOSITE[votedFor];

  const copyFake = useCallback(async () => {
    await navigator.clipboard.writeText(fakeCt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fakeCt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 280, damping: 26 }}
      className="glass rounded-2xl p-5 border border-amber-400/20"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white leading-tight">Coercion-Resistance Proof</h3>
          <p className="text-xs text-slate-500 mt-0.5">Demonstrate your privacy guarantee interactively</p>
        </div>
      </div>

      {/* Scenario banner */}
      <div className="mb-4 px-3 py-2.5 rounded-xl bg-rose/5 border border-rose/15 text-xs text-slate-400 leading-relaxed">
        <span className="text-rose font-semibold">Coercion scenario: </span>
        Someone demands cryptographic proof you voted{" "}
        <span className={clsx("font-mono font-semibold", LABEL[opposite] === "FOR" ? "text-emerald" : "text-rose")}>
          {LABEL[opposite]}
        </span>
        . Below is what GhostGov lets you generate — without touching your real ballot.
      </div>

      {/* Ciphertext comparison */}
      <div className="space-y-2.5 mb-4">
        <CtRow
          label="Your encrypted ballot (on-chain)"
          badge={LABEL[votedFor]}
          badgeClass={COLOR[votedFor]}
          ctHex={realCt}
          frozen={revealed}
          dim={showProof}
        />

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-white/[0.04]" />
          <span className="text-[10px] text-slate-700 font-mono uppercase tracking-widest">vs</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        <CtRow
          label={showProof ? "Fake proof you generated" : "Alternative encryption (same format)"}
          badge={showProof ? `${LABEL[opposite]} ← fake` : LABEL[opposite]}
          badgeClass={showProof
            ? "text-amber-400 bg-amber-400/10 border-amber-400/25"
            : COLOR[opposite]}
          ctHex={fakeCt}
          frozen={revealed}
        />
      </div>

      {/* Reveal toggle */}
      <button
        onClick={() => setRevealed(r => !r)}
        className="w-full flex items-center justify-center gap-2 py-2 mb-3 rounded-xl border border-white/[0.06] text-xs text-slate-500 hover:text-white hover:border-violet/30 transition-all"
      >
        {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        {revealed ? "Scramble ciphertexts" : "Freeze ciphertexts"}
      </button>

      {/* Indistinguishability proof badge */}
      <div className="flex items-start gap-2.5 mb-3 p-3 rounded-xl bg-emerald/5 border border-emerald/15">
        <Check className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          These two ciphertexts are{" "}
          <span className="text-emerald font-semibold">computationally indistinguishable</span>
          {" "}— no algorithm, including the smart contract, can determine which represents your real vote.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setShowProof(s => !s)}
          className={clsx(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium border transition-all",
            showProof
              ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
              : "border-white/[0.07] text-slate-400 hover:text-white hover:border-white/20"
          )}
        >
          <Shield className="w-3.5 h-3.5" />
          {showProof ? "Hide coercer view" : "Show as coercer"}
        </button>

        <button
          onClick={copyFake}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-amber-400/8 border border-amber-400/20 text-amber-400 hover:bg-amber-400/15 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy fake proof"}
        </button>
      </div>

      {/* How it works — expandable */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-400 transition-colors py-1"
      >
        <span>How does this work?</span>
        <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform duration-200", expanded && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="how"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-1.5 text-[11px] text-slate-500 leading-relaxed font-mono border-t border-white/[0.04] mt-1">
              <p><span className="text-violet-light">FHE semantic security:</span> Enc(0) ≡ Enc(1)</p>
              <p>Every encryption samples fresh random noise. The same plaintext produces a statistically distinct ciphertext each time.</p>
              <p><span className="text-violet-light">Result:</span> You can produce a valid-looking <span className="text-amber-400">{LABEL[opposite]}</span> ciphertext without touching the real <span className="text-emerald">{LABEL[votedFor]}</span> ballot already on-chain.</p>
              <p>The coercer cannot distinguish a real ciphertext from a generated one — your actual vote is permanently deniable.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
