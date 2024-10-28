/** @type {import('next').NextConfig} */
const nextConfig = {trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*/',
        destination: 'https://simr-xxm0.onrender.com/api/:path*/',
      }
    ]
  }};

export default nextConfig;
