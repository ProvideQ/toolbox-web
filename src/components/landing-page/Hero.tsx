import { Flex, Heading, Link, Image, HStack } from "@chakra-ui/react";

export const Hero = (props: { title: string }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    height="60vh"
  >
    <Link href="/">
    <HStack spacing={4}>
      <Image src="/g100.svg" height={"6vw"} alt="ProvideQ Logo" />
      <Heading fontSize="6vw" color="kitBlueDark">
        {props.title}
      </Heading>
    </HStack>
    </Link>
  </Flex>
);
