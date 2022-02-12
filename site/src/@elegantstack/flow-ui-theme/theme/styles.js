import baseStyles from '@elegantstack/flow-ui-theme/src/theme/styles'

const styles = {
  ...baseStyles,
  hr: {
    my: 4,
    color: `alpha`
  },
  blockquote: {
    p: {
      color: `text`
    },
    fontStyle: `italic`,
    borderLeftStyle: `solid`,
    borderLeftColor: `alpha`,
    borderLeftWidth: `md`,
    mx: [0, 4],
    px: [3, 4],
    '&.translation': {
      fontSize: 2
    }
  },
}

export default styles;
