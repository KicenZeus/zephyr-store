/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@react-native-async-storage/async-storage'] = false;
    return config;
  },
  turbopack: {}, // Add this to fix Turbopack error
};

module.exports = nextConfig;
