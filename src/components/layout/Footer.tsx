import { HStack, Image, Link, Text, VStack } from "@chakra-ui/react";

export const Footer = () => (
  <footer>
    <VStack borderTopWidth={1} paddingTop={"1rem"}>
      <HStack justifyContent={"space-between"} width={"100%"}>
        <Text color={"gray.500"} paddingY={"3"}>
          ProvideQ is made possible by these partners:
        </Text>
        <HStack>
          <Link href="https://www.kit.edu/legals.php" color={"blue.400"}>
            Imprint
          </Link>
          <Link href="https://www.kit.edu/privacypolicy.php" color={"blue.400"}>
            Privacy Policy
          </Link>
        </HStack>
      </HStack>
      <HStack width={"100%"} justifyContent={"space-between"}>
        <Link href="https://www.kit.edu/">
          <Image src="/KIT.svg" height={"2.5rem"} />
        </Link>
        <Link href="https://www.tu-braunschweig.de/">
          <Image src="/Braunschweig.svg" height={"2.5rem"} />
        </Link>
        <Link href="https://www.uni-koeln.de/">
          <Image src="/Köln.svg" height={"2.5rem"} />
        </Link>
        <Link href="https://www.uni-hannover.de/de/">
          <Image src="/Hannover.svg" height={"2.5rem"} />
        </Link>
        <Link href="https://www.gams.com/">
          <Image src="/gams.svg" height={"2.5rem"} />
        </Link>
        <Link href="https://www.4flow.com/">
          <Image
            src="/4flow.svg"
            height={"2.5rem"}
            style={{ transform: "scale(1.75)", paddingRight: "10px" }}
          />
        </Link>
      </HStack>
    </VStack>
  </footer>
);
