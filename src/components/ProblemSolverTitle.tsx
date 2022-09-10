import { Divider, Flex, Heading, VStack } from "@chakra-ui/react";

export const ProblemSolverTitle = (props: { title: string , text: string}) => (
  <VStack
    justifyContent="center"
    alignItems="center"
    height="60vh"
  >
    <Heading fontSize="3vw">{props.title}</Heading>
    <Heading lineHeight='tall' fontSize='1vw'>{props.text}</Heading>
  </VStack>
);
