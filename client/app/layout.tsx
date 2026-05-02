import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title:       "GhostGov — Vote. Vanish. Count.",
  description: "FHE-encrypted on-chain governance. Your ballot is mathematically invisible — even the contract never sees it.",
  keywords:    ["DAO", "governance", "FHE", "Fhenix", "privacy", "voting", "blockchain", "GhostGov"],
  openGraph: {
    title:       "GhostGov",
    description: "Vote. Vanish. Count. — Coercion-resistant governance powered by Fully Homomorphic Encryption",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Ambient background */}
        <div className="bg-orb bg-orb-1" aria-hidden />
        <div className="bg-orb bg-orb-2" aria-hidden />
        <div className="bg-orb bg-orb-3" aria-hidden />
        <div className="grid-overlay"    aria-hidden />

        <ClientProviders>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
