import React from 'react'
import { Global } from '@emotion/core'
import { ThemeProvider, Flex, Box, css } from 'theme-ui'
import theme from '@elegantstack/flow-ui-theme/src/theme'
import pageContextProvider from '@helpers/pageContextProvider'
import { Header } from '@elegantstack/flow-ui-layout/src/Header/Header'
import { Footer } from '@elegantstack/flow-ui-layout/src//Footer/Footer'
import CookieConsent from "react-cookie-consent";
import { useLocation } from "@reach/router"
import { initializeAndTrack } from 'gatsby-plugin-gdpr-cookies'

export const Layout = ({ children, pageContext, location }) => {
  const testLocation = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <pageContextProvider.Provider value={{ pageContext, location }}>
        <Flex variant='layout.layout'>
          <Global styles={css(theme => theme.global)} />
          <Header />
          <Box variant='layout.body'>{children}</Box>
          <Footer />
          <CookieConsent
            flipButtons
            overlay
            location="bottom"
            buttonText="Accept"
            declineButtonText="Decline"
            cookieName="gatsby-gdpr-google-analytics"
            expires={150}
            enableDeclineButton
            style={{
              background: `#FFF`,
              display: "flex",
              padding: "10px"
            }}
            buttonStyle={{
              display: `inline-flex`,
              minWidth: `10rem`,
              fontSize: `1rem`,
              alignItems: `center`,
              justifyContent: `space-evenly`,
              outline: 0,
              userSelect: `none`,
              WebkitTapHighlightColor: `transparent`,
              WebkitTouchCallout: `none`,
              WebkitUserSelect: `none`,
              KhtmlUserSelect: `none`,
              MozUserSelect: `none`,
              MsUserSelect: `none`,
              borderRadius: `9999px`,
              cursor: `pointer`,
              borderWidth: `3px`,
              borderStyle: `solid`,
              transition: `all 250ms ease`,
              color: `white`,
              background: `#6667AB`,
              borderColor: `#6667AB`,
              ':hover': {
                borderColor: `#6667AB`,
              }
            }}

            declineButtonStyle={{
              display: `inline-flex`,
              minWidth: `10rem`,
              fontSize: `1rem`,
              alignItems: `center`,
              justifyContent: `space-evenly`,
              outline: 0,
              userSelect: `none`,
              WebkitTapHighlightColor: `transparent`,
              WebkitTouchCallout: `none`,
              WebkitUserSelect: `none`,
              KhtmlUserSelect: `none`,
              MozUserSelect: `none`,
              MsUserSelect: `none`,
              borderRadius: `9999px`,
              cursor: `pointer`,
              borderWidth: `3px`,
              borderStyle: `solid`,
              transition: `all 250ms ease`,
              color: `#718096`,
              background: `#edf2f7`,
              borderColor: `#a0aec0`,
              ':hover': {
                borderColor: `6667AB`,
              },
            }}
            onAccept={() => {
              initializeAndTrack(testLocation)
            }}
          >
              <p style={{ color: "#718096" }}> 
              I use Google Analytics with anonymized data to generate website statistics (with your permission). A single cookie will be used in your browser to remember your preference.
              </p>
          </CookieConsent>
        </Flex>
      </pageContextProvider.Provider>
    </ThemeProvider>
  )
}
