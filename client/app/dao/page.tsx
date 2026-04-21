"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Shield, Search, SlidersHorizontal } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { ProposalCard } from "@/components/ProposalCard";
import { CreateProposalModal } from "@/components/CreateProposalModal";
import { useProposals } from "@/hooks/useVeilDAO";
import { clsx } from "clsx";

const FILTERS = ["All", "Active", "Resolved", "Revealed"];

export default function DAOPage() {
  const [filter,  setFilter]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [modalOpen, setModal] = useState(false);

  const { proposals, isLoading, isDemoMode, totalCount } = useProposals();

  const filtered = proposals.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const now         = BigInt(Math.floor(Date.now() / 1000));
    const isActive    = p.endTime > now && !p.resolved;
    const isResolved  = p.resolved && !p.resultsReady;
    const isRevealed  = p.resultsReady;

    if (filter === "Active"   && !isActive)   return false;
    if (filter === "Resolved" && !isResolved) return false;
    if (filter === "Revealed" && !isRevealed) return false;
    return matchSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <NavBar />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Proposals</h1>
            <p className="text-slate-500 text-sm mt-1">
              {Number(totalCount)} total •{" "}
              <span className="text-violet-light">FHE-encrypted voting</span>
              {isDemoMode && (
                <span className="ml-2 text-amber-400 font-mono text-xs">[demo mode]</span>
              )}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet text-white font-semibold text-sm glow-violet"
          >
            <Plus className="w-4 h-4" />
            New Proposal
          </motion.button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search proposals…"
              className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet/40 transition-colors"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 glass rounded-xl p-1">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  filter === f
                    ? "bg-violet/20 text-violet-light"
                    : "text-slate-500 hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* FHE guarantee banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet/[0.06] border border-violet/[0.12] mb-6 text-xs text-slate-400"
        >
          <Shield className="w-4 h-4 text-violet-light flex-shrink-0" />
          <span>
            All votes are encrypted with{" "}
            <span className="text-violet-light font-medium">Fhenix FHE</span>{" "}
            — tallies are computed on ciphertext. Individual choices are provably unrecoverable until the voting period ends.
          </span>
        </motion.div>

        {/* Proposals grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass rounded-2xl h-52 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <SlidersHorizontal className="w-10 h-10 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No proposals match your filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((p, i) => (
              <ProposalCard key={p.id.toString()} proposal={p} index={i} />
            ))}
          </div>
        )}
      </div>

      <CreateProposalModal open={modalOpen} onClose={() => setModal(false)} />
    </div>
  );
}
