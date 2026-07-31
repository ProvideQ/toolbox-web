import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { BsSliders2Vertical } from "react-icons/bs";
import { TextInputMask } from "../../TextInputMask";

interface Props {
  description: ReactNode;
  knapsackProblem: string;
  setKnapsackProblem: (knapsackProblem: string) => void;
}

export function ProblemConfiguration({
  description,
  knapsackProblem,
  setKnapsackProblem,
}: Props) {
  return (
    <VStack width="100%" align="stretch" spacing="4">
      <HStack align="flex-start" spacing="3">
        <Flex
          align="center"
          justify="center"
          boxSize="2.5rem"
          flexShrink={0}
          borderRadius="lg"
          bg="blue.50"
          color="blue.600"
          _dark={{ bg: "blue.900", color: "blue.200" }}
        >
          <BsSliders2Vertical size="1.15rem" />
        </Flex>

        <Box>
          <Heading as="h4" size="md">
            Problem Configuration
          </Heading>
          <Text
            mt="1"
            color="gray.600"
            fontSize="sm"
            fontWeight="medium"
            _dark={{ color: "gray.400" }}
          >
            Knapsack Solver
          </Text>
        </Box>
      </HStack>

      <Divider />

      <Box
        padding="4"
        borderWidth="1px"
        borderColor="blackAlpha.200"
        borderRadius="lg"
        bg="blackAlpha.50"
        color="gray.700"
        fontSize="sm"
        _dark={{
          borderColor: "whiteAlpha.300",
          bg: "whiteAlpha.50",
          color: "gray.300",
        }}
      >
        {description}
      </Box>

      <Box>
        <Text
          mb="2"
          color="gray.500"
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="wide"
        >
          PROBLEM INPUT
        </Text>

        <TextInputMask
          compact
          problemTypeId="Knapsack"
          text={knapsackProblem}
          setText={setKnapsackProblem}
          textPlaceholder="Enter your knapsack problem"
        />
      </Box>
    </VStack>
  );
}
