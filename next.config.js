/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '*.fbcdn.net'       },
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com'      },
      { protocol: 'https', hostname: 'media.licdn.com'    },
    ],
  },

  async rewrites() {
    // Fallback to a placeholder string if environment variables are undefined
    // This prevents Vercel builds from throwing "Invalid rewrites found"
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-fallback.local';
    const signalrUrl = process.env.NEXT_PUBLIC_SIGNALR_URL || 'https://signalr-fallback.local';

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/hubs/:path*',
        destination: `${signalrUrl}/hubs/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',         value: 'DENY' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
}

module.exports = nextConfig