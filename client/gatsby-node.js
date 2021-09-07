const path = require(`path`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const MDXContentPost = path.resolve(`./src/templates/content-template.js`)

  const mdxData = await graphql(`
    {
      allBlogPosts: allMdx {
        nodes {
          slug
        }
      }
    }
  `)
  if (mdxData.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  const {
    data: { allBlogPosts },
  } = mdxData
  allBlogPosts.nodes.forEach(({ slug }) => {
    createPage({
      path: `/${slug}`,
      component: MDXContentPost,
      context: {
        slug,
      },
    })
  })
}
