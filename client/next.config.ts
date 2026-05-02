import type { NextConfig } from "next";
import path from "path";

const emptyModule = path.resolve(process.cwd(), "lib/empty-module.js");

const nextConfig: NextConfig = {
  // Keep these packages out of the RSC/server bundle — they're client-only
  // (behind ssr:false) and their optional deps aren't installed for Node.
  serverExternalPackages: ["@metamask/sdk", "pino"],

  webpack: (config, { webpack }) => {
    config.ignoreWarnings = [/async-storage/, /pino-pretty/];
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /@react-native-async-storage\/async-storage/,
        emptyModule,
      ),
      new webpack.NormalModuleReplacementPlugin(/pino-pretty/, emptyModule),
    );
    return config;
  },
};

export default nextConfig;
