/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: process.cwd(),
  },
  experimental: {

  },
  "transpilePackages": ["apextree", 'spidgorny-react-helpers'],
}

export default nextConfig
