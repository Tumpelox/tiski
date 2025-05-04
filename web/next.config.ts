import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'appwrite.motunix.fi',
      },
    ],
  },
};

export default nextConfig;
