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
    `gatsby-plugin-postcss`,
    `gatsby-plugin-mdx`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`,
      },
    },
  ],
}
