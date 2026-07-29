import type { NextConfig } from "next";
import createWithVercelToolbar from "@vercel/toolbar/plugins/next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev-tools indicator (the floating "N" badge). Dev-only;
  // it never renders in a production build.
  devIndicators: false,
};

const withVercelToolbar = createWithVercelToolbar();

export default withVercelToolbar(nextConfig);
