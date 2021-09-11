/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

const siteMetadata = {
  title: `CDNHatch`,
  description: `Optimizing Website Hosting and Performance for a greener planet.`,
}

module.exports = {
  /* Your site config here */
  siteMetadata: siteMetadata,
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-mdx`,
    `gatsby-plugin-react-helmet-async`,
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/audit/*`] },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`,
      },
    },
  ],
}
