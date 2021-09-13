import React from "react"
import Header from "../components/core/Header"
import { MDXProvider } from "@mdx-js/react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"


const ContentTemplate = ({ data }) => {
  const { mdx } = data
  const { frontmatter, body } = mdx

  return (
    <>
    <MDXProvider>
      <Header />
      <div className="space-y-12 md:space-y-24 pb-12 px-2">
      
      <div className="flex items-center justify-center max-w-4xl mx-auto pt-24">
        <div className="flex flex-col">
          <h1 className="font-bold text-4xl md:text-6xl mb-6">
          {frontmatter.title}
          </h1>
          <div className="prose text-white prose-primary">
          <MDXRenderer>{body}</MDXRenderer>
          </div>
        </div>
      </div>
      </div>
    </MDXProvider>
    </>
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
