/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack is the default bundler in Next.js 15 (--turbo flag in dev, stable in prod).
  // WASM is supported natively — no asyncWebAssembly experiment needed.
  // Node built-in polyfills (fs, net, tls) are handled automatically for browser targets.
  turbopack: {
    // Tell Turbopack to treat .wasm files as async WebAssembly modules
    // (required for @cofhe/sdk's internal FHE WASM runtime)
    rules: {
      "*.wasm": {
        loaders: ["@webassemblyjs/wasm-edit"],
        as: "*.wasm",
      },
    },
  },
};

module.exports = nextConfig;
