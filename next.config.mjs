/** @type {import('next').NextConfig} */
const nextConfig = {trailingSlash: true,output: 'export',
  async rewrites() {
    return [
      {
        source: '/api/:path*/',
        destination: 'https://simr-yo8m.onrender.com/api/:path*/',
      },
      {source:'/set-csrf-token/',
      destination:'https://simr-yo8m.onrender.com/set-csrf-token'
      },
      {source:'/media/:path*',
        destination:'https://simr-yo8m.onrender.com/media/:path*'
      }
    ]
  }};

export default nextConfig;
