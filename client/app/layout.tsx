import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title:       "VeilDAO — Coercion-Resistant Governance",
  description: "Vote without fear. FHE-encrypted ballots aggregated on Fhenix — individual votes are mathematically impossible to trace.",
  keywords:    ["DAO", "governance", "FHE", "Fhenix", "privacy", "voting", "blockchain"],
  openGraph: {
    title:       "VeilDAO",
    description: "Coercion-resistant DAO governance powered by Fully Homomorphic Encryption",
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
