import PropTypes from "prop-types";
import React from "react";

import { ThemeContext } from "../layouts";
import Blog from "../components/Blog";
import Hero from "../components/Hero";
import Seo from "../components/Seo";
import Tags from "../components/Tags";
import Social from "../components/Social";
import Badges from "../components/Badges";

class IndexPage extends React.Component {
  separator = React.createRef();

  scrollToContent = e => {
    this.separator.current.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  render() {
    const {
      data: {
        posts: { edges: posts = [], group: groups },
        m365Dev: { sizes: developer },
        azDevOps: { sizes: devops },
        azAdmin: { sizes: admin },
        azure: { sizes: azure },
        msMcsd: { sizes: mcsd },
        msMcsa: { sizes: mcsa },
        bgDesktop: {
          resize: { src: desktop }
        },
        bgTablet: {
          resize: { src: tablet }
        },
        bgMobile: {
          resize: { src: mobile }
        },
        site: {
          siteMetadata: { facebook }
        }
      }
    } = this.props;

    const backgrounds = {
      desktop,
      tablet,
      mobile
    };

    const badges = {
      developer,
      devops,
      admin,
      azure,
      mcsd,
      mcsa
    };
    return (
      <React.Fragment>
        <ThemeContext.Consumer>
          {theme => (
            <Hero scrollToContent={this.scrollToContent} backgrounds={backgrounds} theme={theme} />
          )}
        </ThemeContext.Consumer>

        <hr ref={this.separator} />
        <div className="wrapper">
          <div className="sideBar">
            <div className="stickyDiv">
              <Badges badges={badges} />
              <Tags groups={groups} />
              <Social />
            </div>
          </div>
          <div className="mainContent">
            <ThemeContext.Consumer>
              {theme => <Blog posts={posts} theme={theme} groups={groups} />}
            </ThemeContext.Consumer>
          </div>
        </div>
        <Seo facebook={facebook} />

        <style jsx>{`
          .stickyDiv {
            position: -webkit-sticky; /* Safari */
            position: sticky;
            top: 50px;
            align-self: flex-start;
          }
          .wrapper {
            max-width: 1000px;
            margin: auto;
            display: flex;
          }

          .mainContent {
            width: 100%;
            height: 100%;
          }

          @from-width tablet {
            .mainContent {
              width: 70%;
              float: left;
            }
          }

          @below tablet {
            .mainContent {
              width: 100%;
            }
          }

          .sideBar {
            padding-top: 60px;
            float: left;
            width: 30%;
            display: flex;
          }

          @below desktop {
            .wrapper {
              width: 80%;
              margin: auto;
            }
          }

          @below tablet {
            .sideBar {
              display: none;
            }
            .wrapper {
              width: 100%;
              margin: auto;
            }
          }

          hr {
            margin: 0;
            border: 0;
          }
        `}</style>
      </React.Fragment>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.object.isRequired
};

export default IndexPage;

//eslint-disable-next-line no-undef
export const guery = graphql`
  query IndexQuery {
    posts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//posts/[0-9]+.*--/" } }
      sort: { fields: [fields___prefix], order: DESC }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
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
    m365Dev: imageSharp(id: { regex: "/developer/" }) {
      sizes(maxWidth: 100) {
        ...GatsbyImageSharpSizes_withWebp
      }
    }
    azDevOps: imageSharp(id: { regex: "/devops/" }) {
      sizes(maxWidth: 100) {
        ...GatsbyImageSharpSizes_withWebp
      }
    }
    azAdmin: imageSharp(id: { regex: "/admin/" }) {
      sizes(maxWidth: 100) {
        ...GatsbyImageSharpSizes_withWebp
      }
    }
    azure: imageSharp(id: { regex: "/azure/" }) {
      sizes(maxWidth: 100) {
        ...GatsbyImageSharpSizes_withWebp
      }
    }
    msMcsd: imageSharp(id: { regex: "/mcsd/" }) {
      sizes(maxWidth: 100) {
        ...GatsbyImageSharpSizes_withWebp
      }
    }
    msMcsa: imageSharp(id: { regex: "/mcsa/" }) {
      sizes(maxWidth: 100) {
        ...GatsbyImageSharpSizes_withWebp
      }
    }
    bgDesktop: imageSharp(id: { regex: "/hero-background/" }) {
      resize(width: 1200, quality: 90, cropFocus: CENTER) {
        src
      }
    }
    bgTablet: imageSharp(id: { regex: "/hero-background/" }) {
      resize(width: 800, height: 1100, quality: 90, cropFocus: CENTER) {
        src
      }
    }
    bgMobile: imageSharp(id: { regex: "/hero-background/" }) {
      resize(width: 450, height: 850, quality: 90, cropFocus: CENTER) {
        src
      }
    }
  }
`;

//hero-background
