import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 1. Turbopack string mapping configuration
  turbopack: {
    resolveAlias: {
      "fs": "./empty-mock.js",
      "path": "./empty-mock.js",
      "crypto": "./empty-mock.js"
    }
  } as any,

  // 2. Webpack direct configuration fallback
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "fs": path.resolve("./empty-mock.js"),
        "path": path.resolve("./empty-mock.js"),
        "crypto": path.resolve("./empty-mock.js"),
      };
    }
    return config;
  },
};

export default nextConfig;