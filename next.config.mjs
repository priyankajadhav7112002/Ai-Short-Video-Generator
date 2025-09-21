/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ignore TypeScript declaration files (.d.ts)
    config.module.rules.push({
      test: /\.d\.ts$/,
      use: 'ignore-loader',
    });
    return config;
  },
};

export default nextConfig;
