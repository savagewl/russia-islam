import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.rusislworld.ru',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.rusislworld.ru',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;