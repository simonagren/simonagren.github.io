import "typeface-open-sans";
import FontFaceObserver from "fontfaceobserver";
import PropTypes from "prop-types";
import React from "react";

import { getScreenWidth, timeoutThrottlerHandler } from "../utils/helpers";
import Footer from "../components/Footer/";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export const ThemeContext = React.createContext(null);
export const ScreenWidthContext = React.createContext(0);
export const FontLoadedContext = React.createContext(false);

import themeObjectFromYaml from "../theme/theme.yaml";

class Layout extends React.Component {
  constructor() {
    super();

    this.state = {
      font400loaded: false,
      font600loaded: false,
      screenWidth: 0,
      headerMinimized: false,
      theme: themeObjectFromYaml
    };

    if (typeof window !== `undefined`) {
      this.loadFont("font400", "Open Sans", 400);
      this.loadFont("font600", "Open Sans", 600);
    }
  }

  timeouts = {};

  componentDidMount() {
    this.setState({
      screenWidth: getScreenWidth()
    });
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.resizeThrottler, false);
    }
  }

  resizeThrottler = () => {
    return timeoutThrottlerHandler(this.timeouts, "resize", 100, this.resizeHandler);
  };

  resizeHandler = () => {
    this.setState({ screenWidth: getScreenWidth() });
  };

  isHomePage = () => {
    if (this.props.location.pathname === "/") {
      return true;
    }

    return false;
  };

  loadFont = (name, family, weight) => {
    const font = new FontFaceObserver(family, {
      weight: weight
    });

    font.load(null, 10000).then(
      () => {
        console.log(`${name} is available`);
        this.setState({ [`${name}loaded`]: true });
      },
      () => {
        console.log(`${name} is not available`);
      }
    );
  };

  render() {
    const { children, data } = this.props;
    const {
      footnote: { html: footnoteHTML },
      pages: { edges: pages },
      mvpavatar: { sizes: mvp }
    } = data;

    return (
      <ThemeContext.Provider value={this.state.theme}>
        <FontLoadedContext.Provider value={this.state.font400loaded}>
          <ScreenWidthContext.Provider value={this.state.screenWidth}>
            <React.Fragment>
              <Header
                path={this.props.location.pathname}
                pages={pages}
                theme={this.state.theme}
                mvp={mvp}
              />
              <main>{children()}</main>
              <Footer html={footnoteHTML} theme={this.state.theme} />

              {/* --- STYLES --- */}
              <style jsx>{`
                main {
                  min-height: 80vh;
                }
              `}</style>
              <style jsx global>{`
                html {
                  box-sizing: border-box;
                }
                *,
                *:after,
                *:before {
                  box-sizing: inherit;
                  margin: 0;
                  padding: 0;
                }
                body {
                  font-family: ${this.state.font400loaded
                    ? "'Open Sans', sans-serif;"
                    : "Arial, sans-serif;"};
                }
                h1,
                h2,
                h3 {
                  font-weight: ${this.state.font600loaded ? 600 : 400};
                  line-height: 1.1;
                  letter-spacing: -0.03em;
                  margin: 0;
                }
                h1 {
                  letter-spacing: -0.04em;
                }
                p {
                  margin: 0;
                }
                strong {
                  font-weight: ${this.state.font600loaded ? 600 : 400};
                }
                a {
                  text-decoration: none;
                  color: #666;
                }
                main {
                  width: auto;
                  display: block;
                }
                blockquote {
                  display: block;
                  background: #fff;
                  padding: 15px 20px 15px 45px;
                  margin: 0 0 20px;
                  position: relative;

                  /*Font*/
                  font-size: 16px;
                  line-height: 1.2;
                  color: #666;
                  font-style: italic;
                  text-align: justify;

                  /*Borders - (Optional)*/
                  border-left: 15px solid orange;
                  border-right: 2px solid orange;

                  /*Box Shadow - (Optional)*/
                  -moz-box-shadow: 2px 2px 15px #ccc;
                  -webkit-box-shadow: 2px 2px 15px #ccc;
                  box-shadow: 2px 2px 15px #ccc;
                }

                blockquote::before {
                  content: '"'; /*Unicode for Left Double Quote*/

                  /*Font*/
                  font-size: 60px;
                  font-weight: bold;
                  color: #999;

                  /*Positioning*/
                  position: absolute;
                  left: 10px;
                  top: 5px;
                }

                blockquote::after {
                  /*Reset to make sure*/
                  content: "";
                }

                blockquote a {
                  text-decoration: none;
                  background: #eee;
                  cursor: pointer;
                  padding: 0 3px;
                  color: #c76c0c;
                }

                blockquote a:hover {
                  color: #666;
                }

                blockquote em {
                  font-style: italic;
                }
              `}</style>
            </React.Fragment>
          </ScreenWidthContext.Provider>
        </FontLoadedContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.func,
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default Layout;

//eslint-disable-next-line no-undef
export const postQuery = graphql`
  query LayoutQuery {
    pages: allMarkdownRemark(
      filter: { id: { regex: "//pages//" }, fields: { prefix: { regex: "/^\\d+$/" } } }
      sort: { fields: [fields___prefix], order: ASC }
    ) {
      edges {
        node {
          fields {
            slug
            prefix
          }
          frontmatter {
            title
            menuTitle
          }
        }
      }
    }
    mvpavatar: imageSharp(id: { regex: "/mvp/" }) {
      sizes(maxWidth: 150) {
        ...GatsbyImageSharpSizes_withWebp
      }
    }
    footnote: markdownRemark(id: { regex: "/footnote/" }) {
      id
      html
    }
  }
`;
