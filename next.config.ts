import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'illustrations.popsy.co',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
};

export default nextConfig;
