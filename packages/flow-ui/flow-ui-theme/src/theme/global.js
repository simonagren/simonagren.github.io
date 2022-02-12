export default {
  html: {
    fontSize: [`85%`, `90%`, `95%`, `100%`]
  },
  '::selection': {
    color: t => t.colors.white,
    background: t => t.colors.omegaDark
  }
}
