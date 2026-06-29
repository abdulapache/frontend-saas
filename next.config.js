/** @type {import('next').NextConfig} */
const nextConfig = {
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
    // Get backend URLs from environment variables
    // These MUST be set in Vercel dashboard for production!
    // See ENV_SETUP.md for configuration instructions
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const signalrUrl = process.env.NEXT_PUBLIC_SIGNALR_URL;

    // Warn in development if env vars are not set
    if (process.env.NODE_ENV === 'development') {
      if (!apiUrl) {
        console.warn('⚠️  NEXT_PUBLIC_API_URL is not set. Using relative paths (/api).');
      }
      if (!signalrUrl) {
        console.warn('⚠️  NEXT_PUBLIC_SIGNALR_URL is not set. SignalR may not connect.');
      }
    }

    // Use provided URLs or fallback to relative paths
    const finalApiUrl = apiUrl || 'http://localhost:3000';
    const finalSignalrUrl = signalrUrl || 'http://localhost:3000';

    return [
      {
        source: '/api/:path*',
        destination: `${finalApiUrl}/api/:path*`,
      },
      {
        source: '/hubs/:path*',
        destination: `${finalSignalrUrl}/hubs/:path*`,
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