module.exports = (
  { node, actions, getNode, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions
  const { localPaths } = pluginOptions
  const { type } = node.internal

  const ARTICLE_TYPES = [
    'Mdx',
    'ContentfulArticle',
    'SanityArticle',
    'StrapiArticle'
  ]
  const newNodeType = 'ArticleTag'

  if (ARTICLE_TYPES.includes(type)) {
    if (type === 'Mdx') {
      const fileNode = getNode(node.parent)
      const source = fileNode && fileNode.sourceInstanceName
      if (!localPaths.find(path => path.name === source)) return
    }

    const { tags = [] } = node.frontmatter || node

    // Create nodes
    tags.forEach(tag => {
      const id = createNodeId(`${tag} >>> ${newNodeType}`)

      // Skip existing node
      if (getNode(id)) return

      const newNode = {
        id,
        name: tag,
        parent: node.id,
        internal: {
          type: newNodeType
        }
      }
      newNode.internal.contentDigest = createContentDigest(newNode)

      createNode(newNode)
    })
  }
}
