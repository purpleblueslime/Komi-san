/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '**.mangadex.network',
      },
      {
        hostname: 'uploads.mangadex.org',
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  sassOptions: {
    includePath: './src/styles/',
  },
};

export default nextConfig;
