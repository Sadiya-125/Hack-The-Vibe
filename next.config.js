/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

export default config;
