import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  semanticTokens: {
    colors: {
      kitGreen: "#009982",
      kitGreenAlpha: "#009982A0",
      kitBlue: "#3974b9",
      kitBlueAlpha: "#3974b9A0",
      kitBlueDark: "#253047",
      kitBlueDarkAlpha: "#253047A0",
    },
  },
});

export default theme;
