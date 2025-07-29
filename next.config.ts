import type { NextConfig } from "next";
const { withPlausibleProxy } = require('next-plausible');

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default withPlausibleProxy()(nextConfig);
