"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Shield, Vote, Plus, Home } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const NAV_LINKS = [
  { href: "/",        label: "Home",     icon: Home   },
  { href: "/dao",     label: "Proposals", icon: Vote   },
  { href: "/propose", label: "Propose",  icon: Plus   },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-[#040812]/80 backdrop-blur-xl border-b border-white/[0.04]" />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="w-8 h-8 rounded-lg bg-violet flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Shield className="w-4 h-4 text-white" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight">
            Ghost<span className="text-gradient">Gov</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-violet/20 text-violet-light"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-light rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Wallet */}
        <div className="flex items-center gap-3">
          {/* FHE badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            FHE Active
          </div>
          <ConnectButton
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </nav>
    </header>
  );
}
