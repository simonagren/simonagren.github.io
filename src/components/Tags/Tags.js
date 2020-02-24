import FaTag from "react-icons/lib/fa/tag";
import PropTypes from "prop-types";
import React from "react";
import { ThemeContext } from "../../layouts";
import Article from "../Article/";
import Headline from "../Article/Headline";
import Seo from "../Seo";
import Link from "gatsby-link";
const _ = require("lodash");

const Tags = props => {
  const { groups } = props;

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <div id={"tags"}>
            <header>
              {/* <Headline title="Tags" theme={theme} /> */}
              <h1>Tags</h1>
            </header>
            <ul className={"tagCloud"}>
              {groups.map(tag => (
                <li key={tag.fieldValue}>
                  <Link to={`/tags/${_.kebabCase(tag.fieldValue)}/`}>
                    <FaTag /> {tag.fieldValue} <div className={"number"}>{tag.totalCount}</div>
                  </Link>
                </li>
              ))}
            </ul>
            <style jsx>{`
              .tagCloud {
                list-style: none;
                padding: 0px;

                li {
                  display: inline-block;
                  margin: 0;
                  padding: 0;

                  :global(a) {
                    display: inline-block;
                    padding: 8px;
                    text-shadow: 1px 0.01px rgba(0, 0, 0, 0.15);
                    border-radius: 6px;
                    margin-bottom: 2px;
                    font-size: 16px;
                    text-decoration: none;
                    color: #fff;
                    transition: 0.2s;
                    outline: 0;
                    margin: 1px;
                    background: #000;
                  }
                  :global(a:hover) {
                    color: orange;
                  }

                  :global(.number) {
                    height: 20px;
                    width: 20px;
                    padding: 1.5px;
                    border-radius: 50%;
                    text-align: center;
                    background: white;
                    color: black;
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 10px;
                    font-size: 12px;
                  }
                }
              }
              h1 {
                font-size: 2.25em;
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
            `}</style>
          </div>
        )}
      </ThemeContext.Consumer>
    </React.Fragment>
  );
};

export default Tags;
