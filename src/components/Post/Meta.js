import React from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";

import FaCalendar from "react-icons/lib/fa/calendar";
import FaUser from "react-icons/lib/fa/user";
import FaTag from "react-icons/lib/fa/tag";

const Meta = props => {
  const { prefix, author: authorName, category, theme, tags } = props;

  return (
    <p className="meta">
      <span>
        <FaCalendar size={18} /> {prefix}
      </span>
      <span>
              <FaUser size={18} /> 
              <Link className="tagslinks" to={`/about`}>{authorName}</Link>
            </span>
      <span>
      <FaTag size={18} />
      {tags && tags.map(tag => (
              <Link key={tag} className="tagslinks" to={`/tags/${tag}`}>{tag}</Link>
            ))}
      </span>

      {/* --- STYLES --- */}
      <style jsx>{`
        .meta {
          display: flex;
          flex-flow: row wrap;
          font-size: 0.8em;
          margin: ${theme.space.m} 0;
          background: transparent;

          :global(svg) {
            fill: ${theme.icon.color};
            margin: ${theme.space.inline.xs};
          }
          span {
            align-items: center;
            display: flex;
            flex-flow: row wrap;
            text-transform: uppercase;
            margin: ${theme.space.xs} ${theme.space.s} ${theme.space.xs} 0;
            
          }
          :global(a.tagslinks + a:before) {
            color: ${theme.icon.color};
            content: "|";
            padding: 0 0.5em;
          }
  
          :global(a.tagslinks:hover) {
            color: orange;
          }
  
          
        }
        @from-width tablet {
          .meta {
            margin: ${`calc(${theme.space.m} * 1.5) 0 ${theme.space.m}`};
          }
        }
      `}</style>
    </p>
  );
};

Meta.propTypes = {
  prefix: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  category: PropTypes.string,
  theme: PropTypes.object.isRequired
};

export default Meta;
