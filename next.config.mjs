/** @type {import('next').NextConfig} */
const nextConfig = {trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*/',
        destination: 'https://simr-yo8m.onrender.com/api/:path*/',
      },
      {source:'/set-csrf-token/',
      destination:'https://simr-yo8m.onrender.com/set-csrf-token'
      }
    ]
  }};

export default nextConfig;
