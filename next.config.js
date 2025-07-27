/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // this will override the experiments
    // config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    config.experiments.topLevelAwait = true 
    return config;
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [new URL("https://i.ebayimg.com/images/**")]
  }
};


export default nextConfig;
