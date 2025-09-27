import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'images.unsplash.com',
      'www.notion-uploads.com',
    ],
  },
}

export default nextConfig
