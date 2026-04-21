"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { clsx } from "clsx";

const HEX_CHARS = "0123456789ABCDEF";

interface Props {
  value:    bigint | number;
  revealed: boolean;
  label:    string;
  color:    "violet" | "rose" | "amber";
  className?: string;
}

const COLOR_MAP = {
  violet: {
    text:   "text-violet-light",
    bg:     "bg-violet/10",
    border: "border-violet/30",
    icon:   "text-violet-light",
    bar:    "bg-violet",
    glow:   "shadow-[0_0_20px_rgba(124,58,237,0.3)]",
  },
  rose: {
    text:   "text-rose-400",
    bg:     "bg-rose/10",
    border: "border-rose/30",
    icon:   "text-rose-400",
    bar:    "bg-rose",
    glow:   "shadow-[0_0_20px_rgba(244,63,94,0.3)]",
  },
  amber: {
    text:   "text-amber-400",
    bg:     "bg-amber/10",
    border: "border-amber/30",
    icon:   "text-amber-400",
    bar:    "bg-amber-500",
    glow:   "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
  },
};

export function EncryptedCounter({ value, revealed, label, color, className }: Props) {
  const c = COLOR_MAP[color];
  const [displayValue, setDisplayValue] = useState("????");
  const [isAnimating,  setIsAnimating]  = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!revealed) {
      // Scramble loop — looks like live encrypted data
      let tick = 0;
      intervalRef.current = setInterval(() => {
        const len = 4;
        let scrambled = "";
        for (let i = 0; i < len; i++) {
          scrambled += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        }
        setDisplayValue(tick % 8 < 4 ? scrambled : "????");
        tick++;
      }, 150);
      return () => clearInterval(intervalRef.current!);
    } else {
      // Reveal animation
      clearInterval(intervalRef.current!);
      setIsAnimating(true);

      const target = Number(value).toString();
      let step = 0;
      const steps = 12;
      const reveal = setInterval(() => {
        step++;
        if (step >= steps) {
          setDisplayValue(target);
          setIsAnimating(false);
          clearInterval(reveal);
        } else {
          let partial = "";
          for (let i = 0; i < target.length; i++) {
            partial +=
              step / steps > i / target.length
                ? target[i]
                : HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          }
          setDisplayValue(partial);
        }
      }, 60);
    }
  }, [revealed, value]);

  return (
    <div
      className={clsx(
        "glass rounded-xl p-4 border transition-all duration-500",
        c.bg, c.border,
        revealed && c.glow,
        className
      )}
    >
      {/* Label + lock icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.div
              key="unlock"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Unlock className={clsx("w-3.5 h-3.5", c.icon)} />
            </motion.div>
          ) : (
            <motion.div key="lock" animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Counter */}
      <div
        className={clsx(
          "font-mono text-2xl font-bold tracking-wider transition-all duration-300",
          revealed ? [c.text, "reveal-number"] : "text-slate-600"
        )}
      >
        {displayValue}
      </div>

      {/* Encrypted indicator */}
      {!revealed && (
        <p className="mt-2 text-[10px] text-slate-600 font-mono">
          enc(x) • FHE protected
        </p>
      )}
    </div>
  );
}
