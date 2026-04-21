"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Loader2, Shield } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { useCreateProposal } from "@/hooks/useVeilDAO";
import { clsx } from "clsx";

const CATEGORIES = ["Protocol", "Treasury", "Security", "Community", "Other"];
const DURATIONS  = [
  { label: "5 minutes (demo)",  value: 300    },
  { label: "1 hour",            value: 3600   },
  { label: "1 day",             value: 86400  },
  { label: "3 days",            value: 259200 },
  { label: "7 days",            value: 604800 },
];

export default function ProposePage() {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [category,    setCategory]    = useState("Protocol");
  const [duration,    setDuration]    = useState(300);

  const { createProposal, isPending, isConfirming, isSuccess } = useCreateProposal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProposal(title, description, category, duration);
  };

  const isBusy = isPending || isConfirming;

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <NavBar />
        <div className="max-w-lg mx-auto text-center py-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-emerald/10 border border-emerald/30 flex items-center justify-center mx-auto mb-6"
          >
            <Shield className="w-9 h-9 text-emerald" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-3">Proposal Created!</h2>
          <p className="text-slate-400 mb-6">
            FHE-encrypted voting is now live. Voters can cast their encrypted ballots.
          </p>
          <Link
            href="/dao"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet text-white font-semibold text-sm glow-violet"
          >
            View All Proposals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <NavBar />

      <div className="max-w-xl mx-auto">
        {/* Back */}
        <Link href="/dao" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass gradient-border rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet/20 border border-violet/30 flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 text-violet-light" />
              </div>
              <div>
                <h1 className="font-bold text-white">Create a Proposal</h1>
                <p className="text-xs text-slate-500">All votes will be FHE-encrypted</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Allocate 50 ETH for security audit"
                maxLength={120}
                required
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet/50 transition-colors"
              />
              <p className="text-[10px] text-slate-600 mt-1 text-right">{title.length}/120</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Description *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Full proposal details, rationale, expected impact, and any relevant links..."
                rows={6}
                required
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet/50 transition-colors resize-none"
              />
            </div>

            {/* Category + Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full appearance-none bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet/50 transition-colors"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Duration</label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full appearance-none bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet/50 transition-colors"
                  >
                    {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Info block */}
            <div className="p-4 rounded-xl bg-violet/[0.05] border border-violet/[0.12] text-xs text-slate-400 leading-relaxed">
              <p className="text-violet-light font-medium mb-1">What happens after you submit:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Your proposal goes live immediately on-chain</li>
                <li>Voters encrypt their ballots locally using Fhenix FHE</li>
                <li>The contract tallies votes on encrypted data — no choices visible</li>
                <li>After the deadline, results are decrypted by the Fhenix oracle</li>
              </ol>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!title || !description || isBusy}
              whileHover={title && description && !isBusy ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                "w-full py-3 rounded-xl text-sm font-semibold transition-all",
                title && description && !isBusy
                  ? "bg-violet text-white glow-violet"
                  : "bg-white/5 text-slate-600 cursor-not-allowed"
              )}
            >
              {isBusy ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isPending ? "Waiting for wallet…" : "Confirming…"}
                </span>
              ) : (
                "Create Proposal"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
