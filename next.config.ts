/** @type {import('next').NextConfig} */

const nextConfig = {

  env: {

    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || '',

  },

  output: 'standalone',

  images: {

    unoptimized: true

  }

}



module.exports = nextConfig
