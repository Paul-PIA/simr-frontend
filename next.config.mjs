/** @type {import('next').NextConfig} */
const nextConfig = {async rewrites() {
    return [
      {
        source: '/api/:path1/?:path2*',
        destination: 'https://simr-xxm0.onrender.com/api/:path1/?:path2*',
      },
      {
        source: '/api/:path*',
        destination: 'https://simr-xxm0.onrender.com/api/:path*/',
      }
    ]
  }};

export default nextConfig;
