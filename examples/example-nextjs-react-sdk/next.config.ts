import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            topLevelAwait: true,
        };
        return config;
    },
};

export default nextConfig;
