import React from 'react'
import { Link } from 'gatsby'
import { Button, Box, Heading, Text } from 'theme-ui'

/**
 * Shadow me to add your own content
 */

const styles = {
  author: {
    display: `inline-block`,
    color: `alpha`
  },
  occupation: {
    mb: 4
  },
  specialty: {
    color: `text`,
    mb: 4
  }
}

const HeroContent = () => (
  <>
    <Heading variant='h1'>
      Hi, I'm <Text sx={styles.author}>Simon Ågren</Text>.
    </Heading>
    <Heading variant='h1' sx={styles.occupation}>
      CTA at Advania and Microsoft MVP
    </Heading>
    <Heading variant='h3' sx={styles.specialty}>
      I write about Microsoft 365 and Azure
    </Heading>
    <Box variant='buttons.group'>
      <Button as={Link} to='/about'>
        About Me
      </Button>
    </Box>
  </>
)

export default HeroContent
