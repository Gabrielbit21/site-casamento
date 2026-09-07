import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.15.85",
  ],

  images: {
    qualities: [
      75,
      90,
    ],
  },
};

export default nextConfig;