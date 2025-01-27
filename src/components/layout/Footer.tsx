import { HStack, Image, Link, Text, VStack } from "@chakra-ui/react";

export const Footer = () => (
  <footer>
    <VStack borderTopWidth={1} paddingTop={"1rem"}>
      <HStack justifyContent={"space-between"} width={"100%"}>
        <Text color={"gray.500"} paddingY={"3"}>
          ProvideQ contributors:
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
        <Link href="https://tva.kastel.kit.edu/index.php">
          <Image src="/KIT.svg" height={"2.5rem"} alt="KIT" />
        </Link>
        <Link href="https://www.gams.com/">
          <Image src="/gams.svg" height={"2.5rem"} alt="GAMS" />
        </Link>
      </HStack>
    </VStack>
  </footer>
);
