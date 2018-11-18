import React from "react";
import PropTypes from "prop-types";

import FaArrowDown from "react-icons/lib/fa/arrow-down";

const Hero = props => {
  const { scrollToContent, backgrounds, theme } = props;

  return (
    <React.Fragment>
      <section className="hero">
      <small className={"visiting"}>You{`'`}re visiting:</small>
        <h1>
        <strong>AgrenPoint</strong><br/>
        development<br/>
        with Simon
        </h1>
        <p>
         SharePoint, Office365, Azure...
         <br/>
         Me sharing what I learn along the way 
        </p>
        <button onClick={scrollToContent} aria-label="scroll">
          <FaArrowDown />
        </button>
      </section>

      {/* --- STYLES --- */}
      <style jsx>{`
        .hero {
          align-items: center;
          background: ${theme.hero.background};
          background-image: url(${backgrounds.mobile});
          background-size: cover;
          color: ${theme.text.color.primary.inverse};
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          min-height: 100vh;
          height: 100px;
          padding: ${theme.space.inset.l};
          padding-top: ${theme.header.height.homepage};
        }

        small {
          color: ${theme.hero.h1.color};
          font-size: ${theme.font.size.xs};
          letter-spacing: 0.3em;
          opacity: 1;
          display: block;
          margin: ${theme.space.stack.m};
        }

        p {
          font-size: ${theme.font.size.s};
          color: ${theme.hero.h1.color};
          text-align: center;
          line-height: 1.5;
          opacity: 0.9;
          margin: ${theme.space.stack.m};
        }

        h1 {
          text-align: center;
          font-size: ${theme.hero.h1.size};
          margin-bottom: 10px;
          color: ${theme.hero.h1.color};
          line-height: ${theme.hero.h1.lineHeight};
          text-remove-gap: both 0 "Open Sans";

          :global(strong) {
            position: relative;

            &::after,
            &::before {
              content: "›";
              color: ${theme.text.color.attention};
              margin: 0 ${theme.space.xs} 0 0;
              text-shadow: 0 0 ${theme.space.s} ${theme.color.neutral.gray.k};
            }
            &::after {
              content: "‹";
              margin: 0 0 0 ${theme.space.xs};
            }
          }
        }

        button {
          background: ${theme.background.color.brand};
          border: 0;
          border-radius: 50%;
          font-size: ${theme.font.size.l};
          padding: ${theme.space.s} ${theme.space.m};
          cursor: pointer;
          width: ${theme.space.xl};
          height: ${theme.space.xl};

          &:focus {
            outline-style: none;
            background: ${theme.color.brand.primary.active};
          }

          :global(svg) {
            fill: ${theme.color.neutral.white};
            animation-duration: ${theme.time.duration.long};
            animation-name: buttonIconMove;
            animation-iteration-count: infinite;
          }
        }

        @keyframes buttonIconMove {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @from-width tablet {
          .hero {
            background-image: url(${backgrounds.tablet});
          }
          
        }

        @media screen and (max-width: 768px) and (orientation:landscape) {
          button {
            font-size: ${theme.font.size.s};
            width: 40px;
            height: 40px;
            margin: 0;
            padding: 0;
          }
          h1 {
            max-width: 90%;
            font-size: 1.5em;
          }

          p {
            font-size: 0.75em;
          }

          .visiting {
            display: none;
          }
          
       }

       @from-width tablet {
        .hero {
          background-image: url(${backgrounds.desktop});
        }
        h1 {
          font-size: ${`calc(${theme.hero.h1.size} * 1.5)`};
        }
      }

        @media screen and (min-width: 769px) and (max-width: 824px) and (orientation:landscape) {
          button {
            font-size: ${theme.font.size.m};
            width: 60px;
            height: 60px;
            margin: 0;
            padding: 0;
          }

          h1 {
            max-width: 80%;
            font-size: 2em;
          }

          .visiting {
            display: none;
          }
       }
       

        @below tablet {
          .hero {
            background-image: url(${backgrounds.tablet});
          }

        }


        
      `}</style>
    </React.Fragment>
  );
};

Hero.propTypes = {
  scrollToContent: PropTypes.func.isRequired,
  backgrounds: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default Hero;
