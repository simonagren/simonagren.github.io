import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import config from "../../../content/meta/config";

const Seo = props => {
  const { data, facebook } = props;
  const postTitle = ((data || {}).frontmatter || {}).title;
  const postDescription = ((data || {}).frontmatter || {}).description;
  const postCover = ((data || {}).frontmatter || {}).cover;
  const postSlug = ((data || {}).fields || {}).slug;

  const title = postTitle ? `${postTitle} - ${config.shortSiteTitle}` : config.siteTitle;
  const description = postDescription ? postDescription : config.siteDescription;
  const image = postCover ? config.siteUrl + postCover : config.siteUrl + config.siteImage;
  const url = config.siteUrl + config.pathPrefix + postSlug;
  debugger;
  return (
    <Helmet
      htmlAttributes={{
        lang: config.siteLanguage,
        prefix: "og: http://ogp.me/ns#"
      }}
    >
      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="fb:app_id" content={facebook.appId} />
      {/* Twitter Card tags */}
      {/* <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:creator"
        content={config.authorTwitterAccount ? config.authorTwitterAccount : ""}
      /> */}
      {/* <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={config.authorTwitterAccount ? config.authorTwitterAccount : ""}/>
      <meta name="twitter:site" content={config.authorTwitterAccount ? config.authorTwitterAccount : ""} /> */}
      {/* <meta name="twitter:title" content={postTitle}></meta>
      <meta name="twitter:description" content={description}></meta>
      <meta name="twitter:image" content={image}
        /> */}
      <meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:site" content="@nytimes"/>
<meta name="twitter:creator" content="@SarahMaslinNir"/>
<meta name="twitter:title" content="Parade of Fans for Houston’s Funeral"/>
<meta name="twitter:description" content="NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here."/>
<meta name="twitter:image" content="http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg"/>  

    </Helmet>
  );
};

Seo.propTypes = {
  data: PropTypes.object,
  facebook: PropTypes.object.isRequired
};

export default Seo;
