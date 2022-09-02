import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  semanticTokens: {
    colors: {
      heroGradientStart: {
        default: '#7928CA',
        _dark: '#e3a7f9',
      },
      heroGradientEnd: {
        default: '#FF0080',
        _dark: '#fbec8f',
      },
    }
  }
});

export default theme
