/** @type {import('next').NextConfig} */
const nextConfig = {trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*/',
        destination: 'https://simr-backend-cyb6.onrender.com/api/:path*/',
      },
      {source:'/set-csrf-token/',
      destination:'https://simr-backend-cyb6.onrender.com/set-csrf-token'
      }
    ]
  }};

export default nextConfig;
