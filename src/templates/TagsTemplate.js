import FaTag from "react-icons/lib/fa/tag";
import PropTypes from "prop-types";
import React from "react";

import Seo from "../components/Seo";
import Blog from "../components/Blog";
import { ThemeContext } from "../layouts";
import Article from "../components/Article";
import Headline from "../components/Article/Headline";

const TagsTemplate = props => {
  const {
    pathContext: { tag },
    data: {
    allMarkdownRemark: { totalCount, edges, group },
      site: {
        siteMetadata: { facebook }
      }
    }
  } = props;

  return (
    <React.Fragment>
        <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <header>
              <Headline theme={theme}>
                <span>Posts with tag</span> <FaTag />
                {tag}
              </Headline>
              <p className="meta">
                There {totalCount > 1 ? "are" : "is"} <strong>{totalCount}</strong> post{totalCount >
                1
                  ? "s"
                  : ""}{" "}
                in the category.
              </p>
              <Blog posts={edges} theme={theme} groups={group}  />
              </header>
              </Article>
            
            )}
        </ThemeContext.Consumer>
      <Seo facebook={facebook} />
    </React.Fragment>
  );
};

TagsTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pathContext: PropTypes.object.isRequired
};

export default TagsTemplate;


export const pageQuery = graphql`
query PostsByTags2 ($tag: String) {
    allMarkdownRemark(
    limit: 1000
    sort: { fields: [fields___prefix], order: DESC }
    filter: { frontmatter: { tags: { in: [$tag] } } }
  ) {
    group(field: frontmatter___tags) {
      fieldValue
      totalCount
    }
    totalCount
    edges {
      node {
        excerpt
        fields {
          slug
          prefix
        }
        frontmatter {
          title
          category
          tags
          author
          cover {
            children {
              ... on ImageSharp {
                sizes(maxWidth: 800, maxHeight: 360) {
                  ...GatsbyImageSharpSizes_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
  site {
    siteMetadata {
      facebook {
        appId
      }
    }
  }
}
`
;
