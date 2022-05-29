/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, webpack, dir }
  ) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      include: [dir],
      exclude: /node_modules/,
      use: [{ loader: "graphql-tag/loader" }],
    })

    config.module.rules.push({
      test: /\.glsl/,
      type: "asset/source",
    })

    return config
  },
}

module.exports = nextConfig
