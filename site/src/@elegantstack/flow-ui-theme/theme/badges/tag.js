import common from '@elegantstack/flow-ui-theme/src/theme/badges/common'

const Tag =  {
  ...common.badge,
  color: `white`,
  bg: `alpha`,
  ':hover': {
    color: `omegaLighter`,
    bg: `omegaDark`,
    borderColor: `omegaDark`
  }
}

export default Tag
