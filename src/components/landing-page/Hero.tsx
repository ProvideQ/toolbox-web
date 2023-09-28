import { Flex, Heading, Link } from "@chakra-ui/react";

export const Hero = (props: { title: string }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    height="60vh"
    bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
    bgClip="text"
  >
    <Link href="/">
      <Heading fontSize="6vw">{props.title}</Heading>
    </Link>
  </Flex>
);
