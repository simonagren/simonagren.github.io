import FaTag from "react-icons/lib/fa/tag";
import FaTwitter from "react-icons/lib/fa/twitter";
import FaLinkedin from "react-icons/lib/fa/linkedin";
import FaGithub from "react-icons/lib/fa/github";
import FaRssSquare from "react-icons/lib/fa/rss-square";


import PropTypes from "prop-types";
import React from "react"
import { ThemeContext } from "../../layouts";
import Article from "../Article/";
import Headline from "../Article/Headline";
import Link from "gatsby-link";
const _ = require("lodash");

const Social = props => {
    const { groups } = props;



return(
  <React.Fragment>
    <ThemeContext.Consumer>
      {theme => (
        <div id={"social"}>
          <header>
            {/* <Headline title="Follow" theme={theme} /> */}
            <h1>Follow</h1>
          </header>
          <div className="social-btns">
            <a className="btn twitter" href="https://twitter.com/agrenpoint"><FaTwitter/></a>
            <a className="btn linkedin" href="https://www.linkedin.com/in/simon-%C3%A5gren-8aa562a1"><FaLinkedin/></a>
            <a className="btn github" href="https://github.com/simonagren"><FaGithub/></a>
            <a className="btn rss" href="/rss"><FaRssSquare/></a>
         </div>
          <style jsx>{`
           #social {
            padding: ${theme.space.inset.default};
            margin: 0 auto;
          }
          @from-width tablet {
            #social {
              padding: ${`calc(${theme.space.default}) calc(${theme.space.default} * 2)`};
              max-width: ${theme.text.maxWidth.tablet};
            }
          }
          @from-width desktop {
            #social {
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
                margin: 0 0 0.5em;
              }
              h2 :global(svg) {
                height: 0.8em;
                fill: ${theme.color.brand.primary};
              }
              .social-btns .btn {

                display: inline-block;
                background-color: #fff;
                width: 40px;
                height: 40px;
                line-height: 40px;
                margin: 0 3px;
                text-align: center;
                position: relative;
                overflow: hidden;
                -webkit-box-shadow: 0 0 3px 1px rgba(95,93,138,.15);
                box-shadow: 0 0 3px 1px rgba(95,93,138,.15);
                opacity: .99;
                padding: 0;
              }

              .social-btns .btn:after {
                content: '';
                width: 200%;
                height: 350%;
                position: absolute;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                top: 165%;
                left: -140%;
              }

              .social-btns .btn:hover {
                color: #fff;
                -webkit-transform: scale(1.2);
                transform: scale(1.2);
                }

              .social-btns .btn{
                font-size: 20px;
                vertical-align: middle;
              }
              
              .twitter svg {
                color: lighten(#3cf, 10%)
              }              
              
              .github i {
                color: lighten(#000, 10%)
              }
              
              .rss i {
                color: lighten(#ff6501, 20%)
              }
              .social-btns .btn:focus:after, .social-btns .btn:hover:after {
                    top: -100%;
                    left: -100%;
                    z-index: -1;
                 }
                
                .social-btns .btn.twitter:after {
                    background-color: #3cf;
                  }
                  
                  .social-btns .btn.twitter {
                    color: #3cf;
                  }

                  .social-btns .btn.twitter:hover,
                  .social-btns .btn.linkedin:hover,
                  .social-btns .btn.github:hover,
                  .social-btns .btn.rss:hover {
                    color: #fff;
                    -webkit-transform: scale(1.2);
                    transform: scale(1.2);
                  }
                  
                  .social-btns .btn.linkedin:after {
                    background-color: #4875B4;
                  }

                  .social-btns .btn.linkedin {
                    color: #4875B4;
                  }

                  .social-btns .btn.github:after,
                  .social-btns .btn.medium:after {
                    background-color: #000;
                  }

                  .social-btns .btn.github {
                    color: #000;
                  }
                  
                  .social-btns .btn.rss:after {
                    background-color: #ff6501;
                  }
                  
                  .social-btns .btn.rss {
                    color: #ff6501;
                  }
            `}</style>
          </div>
      )}
    </ThemeContext.Consumer>
  </React.Fragment>
)};

export default Social;