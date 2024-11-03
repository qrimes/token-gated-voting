import type { NextConfig } from 'next'

const config: NextConfig = {
  env: {
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || '',
  },
  output: 'standalone',
}

console.log('Config loaded. Token available:', !!process.env.CLOUDFLARE_API_TOKEN);

export default config