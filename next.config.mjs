/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three ships untranspiled ESM examples; Next needs to compile them.
  transpilePackages: ['three'],
  experimental: {
    // Keeps the 3D chunk from dragging the whole drei barrel into the initial
    // bundle (brief §6: initial JS under 300KB excluding the 3D chunk).
    optimizePackageImports: ['@react-three/drei'],
  },
};

export default nextConfig;
