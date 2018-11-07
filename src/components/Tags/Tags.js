import FaTag from "react-icons/lib/fa/tag";
import PropTypes from "prop-types";
import React from "react"
import { ThemeContext } from "../../layouts";
import Article from "../Article/";
import Headline from "../Article/Headline";
import Seo from "../Seo";
import Link from "gatsby-link";
const _ = require("lodash");

const Tags = props => {
    const { groups } = props;

return(
  <React.Fragment>
    <ThemeContext.Consumer>
      {theme => (
        <div id={"tags"}>
          <header>
            {/* <Headline title="Tags" theme={theme} /> */}
            <h1>Tags</h1>
          </header>
          {groups.map(tag => (
            <section key={tag.fieldValue}>
            <Link to={`/tags/${_.kebabCase(tag.fieldValue)}/`}>
            <h2>
              <FaTag /> {tag.fieldValue} ({tag.totalCount})  
            </h2>
            </Link>
            </section>
          ))}
          <style jsx>{`
              #tags {
                padding: ${theme.space.inset.default};
                margin: 0 auto;
              }
              @from-width tablet {
                #tags {
                  padding: ${`calc(${theme.space.default}) calc(${theme.space.default} * 2)`};
                  max-width: ${theme.text.maxWidth.tablet};
                }
              }
              @from-width desktop {
                #tags {
                  padding: ${`calc(${theme.space.default} * 1.5) 0 calc(${
                    theme.space.default
                  } * 1.5)`};
                  max-width: ${theme.text.maxWidth.desktop};
                }
              }
              h1 {
                font-size: 2.5em;
                padding: 20px 0;
              }
              h2 {
                font-size: 1.2em;
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
          </div>
      )}
    </ThemeContext.Consumer>
  </React.Fragment>
);
};

export default Tags;