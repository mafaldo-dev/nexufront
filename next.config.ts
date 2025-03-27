import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
	  remotePatterns: [
		{
			protocol: 'https',
			hostname: 'upload.wikimedia.org'
		},
		{
			protocol: 'https',
			hostname: 'external-content.duckduckgo.com'
		},
		{
			protocol: 'https',
			hostname: 'proxy.duckduckgo.com'
		}
	  ],
	  unoptimized: true,
  }
};

export default nextConfig;
