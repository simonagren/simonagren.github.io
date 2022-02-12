import React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { MDXProvider } from '@theme-ui/mdx'
// import components from '@components/Mdx'
import { preToCodeBlock } from "mdx-utils"
import { Code } from "../../../components/Code"

const components = {
  pre: (preProps) => {
    const props = preToCodeBlock(preProps)
    if (props) {
      return <Code {...props} />
    } else {
      return <pre {...preProps} />
    }
  },
}

export const PostBody = ({ body }) => {
  return (
    <MDXProvider components={components}>
      <MDXRenderer>{body}</MDXRenderer>
    </MDXProvider>
  )
}
