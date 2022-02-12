import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage as Img, getImage } from 'gatsby-plugin-image'
import { Box, Text, Card, Flex } from 'theme-ui'
import { Layout, Stack, Main } from '@layout'
import PageTitle from '@components/PageTitle'
import Divider from '@components/Divider'
import Section from '@components/Section'
import Seo from '@widgets/Seo'

/**
 * Shadow me to add your own content
 */

const styles = {
  imageWrapper: {
    borderRadius: `default`,
    overflow: `hidden`,
    position: `relative`
  },
  button: {
    display: [`none`, `block`],
    position: `absolute`,
    bottom: 4,
    right: 4
  },
  grid: {
    flexWrap: [`wrap`, null, `nowrap`],
    ' > div + div': {
      ml: [0, 0, 5]
    }
  },
  column: {
    flex: `auto`,
    flexBasis: [`full`, null, `1/2`]
  }
}

// export default props => {}

const About = (props) => {
  const data = useStaticQuery(aboutQuery)
  const image = getImage(data.avatar)

  return (
    <Layout {...props}>
      <Seo title='About' />
      <Divider />
      <Stack>
        <Main>
          <PageTitle
            header='About Me'
            subheader='Do more of what makes you happy'
          />
          <Divider />
          <Box sx={styles.imageWrapper}>
            <Img image={image} />
          </Box>
          <Divider />
          <Flex sx={styles.grid}>
            <Box sx={styles.column}>
              <Section title='My Story'>
                <Text variant='p'>
                My happy place has been the golf course for the last 25 years. This is where I get centered, and time doesn't really matter.
                </Text>
                <Text variant='p'>
                My name is Simon "King of the North" Ågren, and I live in Northern Sweden. I'm a proud father of two boys that I get to have every other week.</Text>
                <Text variant='p'>
                I work as Chief Technical Architect (CTA) for Advania's specialist unit Knowledge. As a CTA, I'm basically practice lead for Modern Work, which revolves mainly around building the internal community, ensuring quality in our customer deliveries, and business strategy.
                </Text>
                <Text variant='p'>
                I've been awarded as Microsoft MVP since 2019, which enables me to work closely with Microsoft. I track what's coming and try to predict business opportunities and how this maps against current and anticipated customers' needs. 
                </Text>
                <Text variant='p'>
                I come from a developer background. Nowadays, I write less code and focus on helping companies get the most out of their Microsoft 365 and tailor it to their business needs.
                </Text>
                <Text variant='p'>
                What you will see on this website is me writing about technical or non-technical topics revolving primarily:
                </Text>
                <Text variant='p'>
                  <ul>
                    <li>Microsoft 365</li>
                    <li>Azure</li>
                    <li>Power Platform</li>
                  </ul>
                </Text>
              </Section>
            </Box>
            <Box sx={styles.column}>
              <Section title='Public speaking'>
                <Card variant='paper'>
                I'm a decently experienced international speaker. If you want me to speak at your event or company, feel free to contact me. 
                </Card>
              </Section>
              <Divider />
              <Section title='Technical Writing'>
                <Card variant='paper'>
                I love technical writing and blogging. I have been writing blogs, technical documentation, and how-tos for Microsoft. If you want me to write something with or for you, please contact me.  
                </Card>
              </Section>
            </Box>
          </Flex>
        </Main>
      </Stack>
    </Layout>
  )
}

const aboutQuery = graphql`
  query AboutQuery2 {
    avatar: file(absolutePath: { regex: "/about.(jpeg|jpg|gif|png)/" }) {
      childImageSharp {
        gatsbyImageData(
          width: 1140
          height: 500
          transformOptions: { cropFocus: NORTH }
        )
      }
    }
  }
`
export default About