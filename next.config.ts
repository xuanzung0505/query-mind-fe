import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http", // or 'http'
        hostname: "localhost", // Replace with the actual hostname of your image source
        port: "4000", // Optional: Specify a port if needed
        pathname: "*", // Optional: Specify a path or use a wildcard
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
