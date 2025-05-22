/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'qitxftuzktzxbkacneve.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/imagery/**',
      },
    ],
  },
  experimental: {
    // ... existing experimental options ...
  }
}

module.exports = nextConfig 