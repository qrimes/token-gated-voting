/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || '',
  },
}

module.exports = nextConfig