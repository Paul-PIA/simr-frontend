/** @type {import('next').NextConfig} */
const nextConfig = {async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://simr-xxm0.onrender.com/api/:path*/',
      }
    ]
  }};

export default nextConfig;
