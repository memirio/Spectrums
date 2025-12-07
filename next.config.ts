import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
  // Ensure Prisma binaries are included in the build
  serverExternalPackages: ['@prisma/client'],
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', '@prisma/client', 'pg'],
  },
  // Workaround for NextAuth v5 beta module resolution issue with Next.js 16
  transpilePackages: ['next-auth'],
};

export default nextConfig;
