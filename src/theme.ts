import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  semanticTokens: {
    colors: {
      kitGreen: "#00876C",
      kitGreenAlpha: "#00876CA0",
      heroGradientStart: {
        default: "kitGreen",
        _dark: "#e3a7f9",
      },
      heroGradientEnd: {
        default: "#FF0080",
        _dark: "#fbec8f",
      },
    },
  },
});

export default theme;
