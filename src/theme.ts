import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  semanticTokens: {
    colors: {
      kitGreen: "#009682",
      kitGreenAlpha: "#009682A0",
      kitBlue: "#4664aa",
      kitBlueAlpha: "#4664aaA0",
      heroGradientStart: {
        default: "kitBlue",
        _dark: "#e3a7f9",
      },
      heroGradientEnd: {
        default: "kitGreen",
        _dark: "#fbec8f",
      },
    },
  },
});

export default theme;
