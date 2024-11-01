import type { NextConfig } from 'next'
import { withCloudflare } from '@cloudflare/next-on-pages/custom-build-config'

const config: NextConfig = {
  env: {
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || '',
  },
}

console.log('Config loaded. Token available:', !!process.env.CLOUDFLARE_API_TOKEN);

// Export the config wrapped with the Cloudflare adapter
export default withCloudflare(config)