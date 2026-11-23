/** @type {import('next').NextConfig} */
const upstream = process.env.API_UPSTREAM || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const nextConfig = {
  // The browser talks to /server-api on this same origin; Next.js forwards it to
  // the Express API. This avoids CORS when previewing v2 on port 3001.
  async rewrites() {
    return [{ source: "/server-api/:path*", destination: `${upstream}/:path*` }];
  },
};

export default nextConfig;
