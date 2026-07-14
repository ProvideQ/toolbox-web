import { Flex, Heading, HStack, Image, Link } from "@chakra-ui/react";

export const Hero = (props: { title: string }) => (
  <Flex justifyContent="center" alignItems="center">
    <Link href="/">
      <HStack spacing={4}>
        <Image src="/ProvideQ.svg" height={"8em"} alt="ProvideQ Logo" />
        <Heading fontSize="8em" color="kitBlueDark">
          {props.title}
        </Heading>
      </HStack>
    </Link>
  </Flex>
);
