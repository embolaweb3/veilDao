"use client";

import dynamic from "next/dynamic";

// dynamic + ssr:false must live in a Client Component.
// This wrapper keeps layout.tsx as a pure Server Component.
const Providers = dynamic(
  () => import("@/components/Providers").then((m) => m.Providers),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
