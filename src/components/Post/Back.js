import React from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";


import FaArrowLeft from "react-icons/lib/fa/arrow-left";

const Back = props => {
  const {
    theme
  } = props;

  return (
    <React.Fragment>
            <div className="links">
            <a onClick={() => window.history.back()}>
            <FaArrowLeft />
            <h4>
              Back
            </h4>
            </a>
            </div>
      {/* --- STYLES --- */}
      <style jsx>{`
      .links {
          display: flex;
          flex-direction: column;
          padding: 0 ${theme.space.m} ${theme.space.l};
          border-bottom: 1px solid ${theme.line.color};
          margin: ${theme.space.stack.l};

          :global(a) {
            display: flex;
            cursor: pointer;
          }

          :global(svg) {
            fill: ${theme.color.special.attention};
            width: 35px;
            height: 35px;
            flex-shrink: 0;
            flex-grow: 0;
            margin: ${theme.space.inline.m};
          }
        }

        h4 {
          font-weight: 600;
          margin: 0;
          font-size: 1.8em;
          transition: all 0.5s;

        }

        @from-width desktop {
          .links {
            flex-direction: row-reverse;
            justify-content: center;

            :global(a) {
              flex-basis: 50%;
            }

            :global(a:nth-child(2)) {
              margin: 0;
            }
            :global(svg) {
              transition: all 0.5s;
              margin: ${theme.space.inline.s};
            }
          }

          @media (hover: hover) {
              
            .links :global(a:hover svg) {
              transform: scale(1.5);
              margin-right: 10px;
            }
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Back.propTypes = {
  theme: PropTypes.object.isRequired
};

export default Back;
