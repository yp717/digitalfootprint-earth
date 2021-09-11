import React from "react"
import Header from "../components/core/Header"
import { MDXProvider } from "@mdx-js/react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

const ContentTemplate = ({ data }) => {
  const { mdx } = data
  const { frontmatter, body } = mdx

  return (
    <MDXProvider>
      <Header />
      <div className="container row margin-10-t margin-10-b">
        <div className="col-xs-12 pad-5-lr">
          <h1 className="text-align-left is-background-blue-text">
            {frontmatter.title}
          </h1>
        </div>
        <div className="mx-auto">
          <MDXRenderer>{body}</MDXRenderer>
        </div>
      </div>
    </MDXProvider>
  )
}

export default ContentTemplate

export const contentTemplateQuery = graphql`
  query ($slug: String!) {
    mdx(slug: { eq: $slug }) {
      body
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
      }
    }
  }
`
