import React from "react";
import { ThemeContext } from "../../layouts";
const _ = require("lodash");
import Img from "gatsby-image";

const Badges = props => {
  const { badges } = props;
  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <div id={"badges"}>
            <div className="badges-btns">
              <a className="btn" href="#" target="_blank" rel="noopener">
                <Img sizes={badges.developer} />
              </a>
              <a className="btn" href="#" target="_blank" rel="noopener">
                <Img sizes={badges.devops} />
              </a>
              <a className="btn" href="#" target="_blank" rel="noopener">
                <Img sizes={badges.admin} />
              </a>
              <a className="btn" href="#" target="_blank" rel="noopener">
                <Img sizes={badges.azure} />
              </a>
              <a className="btn" href="#" target="_blank" rel="noopener">
                <Img sizes={badges.mcsd} />
              </a>
              <a className="btn" href="#" target="_blank" rel="noopener">
                <Img sizes={badges.mcsa} />
              </a>
            </div>
            <style jsx>{`
              #badges {
                padding: ${theme.space.inset.default};
                margin: 0 auto;
              }
              @from-width tablet {
                #badges {
                  padding: ${`calc(${theme.space.default}) calc(${theme.space.default} * 2)`};
                  max-width: ${theme.text.maxWidth.tablet};
                }
              }
              @from-width desktop {
                #badges {
                  padding: ${`55px 0 0`};
                  max-width: ${theme.text.maxWidth.desktop};
                }
              }
              h1 {
                font-size: 2.5em;
                padding: 20px 0;
              }
              h2 {
                margin: 0 0 0.5em;
              }
              h2 :global(svg) {
                height: 0.8em;
                fill: ${theme.color.brand.primary};
              }
              .badges-btns .btn {
                display: inline-block;
                background-color: transparent;
                width: 90px;
                height: 90px;
                line-height: 90px;
                margin: 0 3px;
                text-align: center;
                position: relative;
                overflow: hidden;
                padding: 0;
              }

              .badges-btns .btn.first {
                width: 300px;
              }

              .badges-btns .btn:hover {
                color: #fff;
                -webkit-transform: scale(1.2);
                transform: scale(1.2);
                z-index: 10000;
              }

              .badges-btns .btn {
                font-size: 20px;
                vertical-align: middle;
              }
            `}</style>
          </div>
        )}
      </ThemeContext.Consumer>
    </React.Fragment>
  );
};

export default Badges;
