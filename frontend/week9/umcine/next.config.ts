import type { NextConfig } from "next";

const config: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/photo-1516321318423-f06f85e504b3",
    }],
  },
};

export default config;
