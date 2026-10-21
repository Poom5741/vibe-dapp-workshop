/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — the whole site is client-side, so `next build` emits ./out
  // which Cloudflare Workers serves as static assets (see app/wrangler.toml
  // and docs/07-go-live.md).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
