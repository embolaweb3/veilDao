"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, arbitrumSepolia } from "wagmi/chains";
import { defineChain } from "viem";

// Fhenix networks with CoFHE — auto-injected by @cofhe/hardhat-plugin on testnet
// For local dev, hardhat mock network is used.
export const localCoFHE = defineChain({
  id:   31337,
  name: "LocalCoFHE",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
});

export const wagmiConfig = getDefaultConfig({
  appName:     "VeilDAO — Coercion-Resistant Governance",
  projectId:   process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "veildao-demo",
  chains:      [sepolia, arbitrumSepolia, localCoFHE],
  ssr:         true,
});

export const SUPPORTED_CHAIN_IDS = [sepolia.id, arbitrumSepolia.id, localCoFHE.id];
