import Link from "gatsby-link";
import PropTypes from "prop-types";
import React from "react";
import VisibilitySensor from "react-visibility-sensor";
import FaLinkedinSquare from "react-icons/lib/fa/linkedin-square";
import FaTwitterSquare from "react-icons/lib/fa/twitter-square";
import FaGithubSquare from "react-icons/lib/fa/github-square";

import { ScreenWidthContext, FontLoadedContext } from "../../layouts";
import config from "../../../content/meta/config";
import Menu from "../Menu";
import {LinkedinIcon } from 'react-share';
import GithubIcon from "!svg-react-loader!../../images/svg-icons/github.svg?name=GithubLogo";
import avatar from "../../images/jpg/avatar.jpg";
import { SocialIcon } from 'react-social-icons';

class Sidebar extends React.Component {
  state = {
    fixed: false
  };

  visibilitySensorChange = val => {
    if (val) {
      this.setState({ fixed: false });
    } else {
      this.setState({ fixed: true });
    }
  };

  getHeaderSize = () => {
    const fixed = this.state.fixed ? "fixed" : "";
    const homepage = this.props.path === "/" ? "homepage" : "";

    return `${fixed} ${homepage}`;
  };

  render() {
    const { pages, path, theme } = this.props;
    const { fixed } = this.state;

    return (
      <React.Fragment>
        <section className={"testBar"}>
          <h1>Hej</h1>
        </section>

        {/* --- STYLES --- */}
        <style jsx>{`

          
          .testBar {
            width: 30%;
            align-items: center;
            background: red;
          }

        `}</style>
      </React.Fragment>
    );
  }
}

// Header.propTypes = {
//   pages: PropTypes.array.isRequired,
//   path: PropTypes.string.isRequired,
//   theme: PropTypes.object.isRequired
// };

export default Sidebar;
