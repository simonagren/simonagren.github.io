import React from "react"
import Highlight, { defaultProps } from "prism-react-renderer"
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live"
import theme from 'prism-react-renderer/themes/dracula'
import Confetti from 'react-dom-confetti'
import Prism from "prism-react-renderer/prism";

(typeof global !== "undefined" ? global : window).Prism = Prism;

require("prismjs/components/prism-powershell");
require("prismjs/components/prism-csharp");

const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: '10px',
    height: '10px',
    perspective: '500px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
  }

  const copyToClipboard = str => {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }

  const Wrapper = props => <div style={{ position: 'relative' }} {...props} />

const ConfettiWrapper = props => (
  <div style={{ position: 'absolute', top: 0, right: 0 }} {...props} />
)

export const Code = ({ codeString, children, language, ...props }) => {
    const [isCopied, setIsCopied] = React.useState(false)
    const [buttonBg, setButtonBg] = React.useState("#E2E8F022")

    const styles={
      border: 'none',
      boxShadow: 'none',
      textDecoration: 'none',
      position: 'absolute',
      top: 0,
      right: 0,
      margin: '8px',
      padding: '8px 12px',
      background: buttonBg,
      color: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'sans-serif',
      lineHeight: '1',
      zIndex: 2
    }

    if (props['react-live']) {
      return (
        <LiveProvider code={codeString} noInline={true}>
          <LiveEditor />
          <LiveError />
          <LivePreview />
        </LiveProvider>
      )
    } else {
      return (
        <Wrapper>
          <Highlight
            {...defaultProps}
            code={codeString}
            language={language}
            theme={theme}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <> 
               <button
               style={styles}
               onClick={() => {
                 copyToClipboard(codeString)
                 setIsCopied(true)
                 setTimeout(() => setIsCopied(false), 3000)
               }}
               onMouseEnter={() => setButtonBg("#6667AB")}
               onMouseLeave={() => setButtonBg("#E2E8F022")}
             >
               {isCopied ? '🎉 Copied!' : 'Copy'}
             </button>
              
              <pre
                className={className}
                style={{
                  ...style,
                  padding: '3rem 1rem 1rem 1rem ',
                  position: 'relative',
                  overflow: 'auto',

                }}
              >
               
  
                {tokens.map((line, i) => (
                  <div {...getLineProps({ line, key: i })} style={style}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
              </>
            )}
          </Highlight>
          <ConfettiWrapper>
            <Confetti active={isCopied} config={config} />
          </ConfettiWrapper>
        </Wrapper>
      )
    }
  }