import FaTag from "react-icons/lib/fa/tag";
import FaArrowRight from "react-icons/lib/fa/arrow-right";
import PropTypes from "prop-types";
import React from "react"
import { ThemeContext } from "../layouts";
import Article from "../components/Article/";
import Headline from "../components/Article/Headline";
import List from "../components/List";
import Seo from "../components/Seo";
import Link from "gatsby-link";


const TagsPane = props => {
  const {
    data: {
      posts: { 
        edges: posts,
        edges: group
       },
      site: {
        siteMetadata: { facebook }
      } 
    }
} = props;

// Tags
const tagss = {};
posts.forEach(edge => {
  const {
    node: {
      frontmatter: { tags }
    }
  } = edge;

  if (tags && tags != null) {
    tags.forEach(tag => {
      if (!tagss[tag]) {
        tagss[tag] = [];
      }
      tagss[tag].push(edge);
    })
  }
});

const tagsList = [];

for (var key in tagss) {
  tagsList.push([key, tagss[key]]);
}

return(
  <React.Fragment>
    <ThemeContext.Consumer>
      {theme => (
        <Article theme={theme}>
          <header>
            <Headline title="Post by tags" theme={theme} />
          </header>
          {tagsList.map(item => (
            <section key={item[0]}>
            <Link to={`/tags/${item[0]}`}><h2>
              <FaTag /> {item[0]}  
            </h2>
            </Link>
            {item[1].length > 5 && <p>Showing 5 of {item[1].length} posts</p> }
            
            <List edges={item[1].slice(0, Math.min(5, item[1].length))} theme={theme} />

            </section>
          ))}
          <style jsx>{`
              h2 {
                margin: 0 0 0.5em;
              }
              h2 :global(svg) {
                height: 0.8em;
                fill: ${theme.color.brand.primary};
              }
              :global(.arrow) {
                display: inline-block;
                fill: ${theme.color.special.attention};
              }
            `}</style>
          </Article>
      )}
    </ThemeContext.Consumer>
    <Seo facebook={facebook} />
  </React.Fragment>
);
};

TagsPane.propTypes = {
  data: PropTypes.object.isRequired
};

export default TagsPane;

export const query = graphql`
query PostsQueryTags {
  site {
    siteMetadata {
      facebook {
        appId
      }
    }
  }
  posts:allMarkdownRemark(
     filter: { fileAbsolutePath: { regex: "//posts/[0-9]+.*--/" } }
     sort: { fields: [fields___prefix], order: DESC }
  ) {
    edges {
      node {
        excerpt
          fields {
            slug
            prefix
          }
        frontmatter {
          title
          tags
        }
      }
    }
    group(field: frontmatter___tags) {
      fieldValue
      totalCount
    }
  }
}`
;
