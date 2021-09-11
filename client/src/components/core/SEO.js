import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet-async"

const SEO = ({ title, description }) => {
  // console.log(title)
  // console.log(description)
  const { site } = useStaticQuery(graphql`
    query SEO {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
      favicon: file(name: { eq: "favicon" }) {
        publicURL
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description

  React.useEffect(() => {
    document.body.classList.remove("noscroll")
  }, [])
  return (
    <Helmet
      title={title}
      meta={[
        {
          property: `title`,
          content: title,
        },
        {
          property: `description`,
          content: metaDescription,
        },
      ]}
    />
  )
}

// SEO.defaultProps = {
//   keywords: [],
//   meta: [],
// }

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  //   keywords: PropTypes.arrayOf(PropTypes.string),
  //   meta: PropTypes.array,
}

export default SEO
