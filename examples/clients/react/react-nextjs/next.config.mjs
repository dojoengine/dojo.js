/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // future: {
    //     webpack5: false,
    // },
    // experimental: {
    //     esmExternals: 'loose',
    // },
    webpack: (config, { nextRuntime, isServer }) => {
        // console.log(`nextRuntime:`,isServer,nextRuntime)
        // allow wasm
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        };
        return config;
    },
};

export default nextConfig;
