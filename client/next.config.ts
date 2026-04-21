import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack (next dev --turbo) handles WASM natively.
  // Node built-in polyfills (fs, net, tls) are excluded automatically for browser targets.
};

export default nextConfig;
