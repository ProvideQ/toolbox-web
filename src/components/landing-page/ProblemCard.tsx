import { LinkBox, LinkOverlay, Box, Image, Badge } from "@chakra-ui/react";
import NextLink from "next/link";

interface ProblemCardProps {
  href: string;
  new: boolean;
  tags: string[];
  problemName: string;
  description: string;
}

export const ProblemCard = (props: ProblemCardProps) => {
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
            {props.tags.map((tag) => (
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
            <LinkOverlay>{props.problemName}</LinkOverlay>
          </NextLink>
        </Box>

        <Box>{props.description}</Box>

        <Box fontWeight="semibold" mt="4">
          Solve this problem &rarr;
        </Box>
      </Box>
    </LinkBox>
  );
};
