import { Heading, VStack } from "@chakra-ui/react";

export const SolverTitle = (props: { title: string , text: string}) => (
  <VStack
    justifyContent="center"
    alignItems="center"
    height="60vh"
  >
    <Heading size='2xl'>{props.title}</Heading>
    <Heading lineHeight='tall' size='md'>{props.text}</Heading>
  </VStack>
);
