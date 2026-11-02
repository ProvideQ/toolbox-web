import { Stack, StackProps } from "@chakra-ui/react";

const paddingX = "1rem";
export const mainContentMaxWidth = "46rem";

export const Main = (props: StackProps) => (
  <Stack
    spacing="1.5rem"
    width="100%"
    maxWidth={`calc(${mainContentMaxWidth} + 2 * ${paddingX})`}
    pt="8rem"
    px={paddingX}
    {...props}
  />
);
