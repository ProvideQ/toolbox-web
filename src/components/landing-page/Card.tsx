import { Badge, Box, LinkBox, LinkOverlay } from "@chakra-ui/react";
import NextLink from "next/link";

export interface CardProps {
  href: string;
  new?: boolean;
  tags?: string[];
  title: string;
  description: string;
}

export const Card = (props: CardProps & { refer: string }) => {
  return (
    <LinkBox maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p="6">
        <Box display="flex" alignItems="baseline">
          {props.new && (
            <Badge borderRadius="full" px="2" colorScheme="blue" mr="2">
              New!
            </Badge>
          )}
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
          >
            {props.tags &&
              props.tags.map((tag) => (
                <Badge
                  key={tag}
                  borderRadius="full"
                  px="2"
                  colorScheme="teal"
                  mr="2"
                >
                  {tag}
                </Badge>
              ))}
          </Box>
        </Box>

        <Box
          mt="2"
          mb="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          <NextLink href={props.href} passHref>
            <LinkOverlay>{props.title}</LinkOverlay>
          </NextLink>
        </Box>

        <Box>{props.description}</Box>

        <Box fontWeight="semibold" mt="4">
          {props.refer} &rarr;
        </Box>
      </Box>
    </LinkBox>
  );
};
