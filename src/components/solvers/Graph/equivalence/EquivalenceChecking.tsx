import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertStatus,
  AlertTitle,
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  Heading,
  HStack,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaCodeCompare } from "react-icons/fa6";
import {
  EquivalenceCheckResponse,
  EquivalenceCheckStatus,
  useEquivalenceChecking,
} from "./useEquivalenceChecking";

interface StatusPresentation {
  alertStatus: AlertStatus;
  title: string;
  description: string;
  colorScheme: string;
}

const STATUS_PRESENTATION: Record<EquivalenceCheckStatus, StatusPresentation> =
  {
    equivalent: {
      alertStatus: "success",
      title: "Equivalent",
      description: "The selected circuits exhibit equivalent behavior.",
      colorScheme: "green",
    },
    not_equivalent: {
      alertStatus: "warning",
      title: "Not equivalent",
      description: "The selected circuits do not exhibit equivalent behavior.",
      colorScheme: "orange",
    },
    unknown: {
      alertStatus: "info",
      title: "Inconclusive",
      description:
        "The checker could not determine whether the circuits match.",
      colorScheme: "blue",
    },
    error: {
      alertStatus: "error",
      title: "Check failed",
      description: "The equivalence check could not be completed.",
      colorScheme: "red",
    },
  };

export function EquivalenceChecking() {
  const equivalenceChecking = useEquivalenceChecking();

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
          <FaCodeCompare size="1.15rem" />
        </Flex>

        <Box>
          <Heading as="h4" size="md">
            Equivalence Checking
          </Heading>
          <Text
            mt="1"
            color="gray.600"
            fontSize="sm"
            _dark={{ color: "gray.400" }}
          >
            Compare the OpenQASM inputs of two problem nodes.
          </Text>
        </Box>
      </HStack>

      <Divider />

      {equivalenceChecking.isRunning ? (
        <SelectionPanel
          selectedNodeCount={equivalenceChecking.selectedNodeCount}
          canCheck={equivalenceChecking.canCheck()}
          isChecking={equivalenceChecking.isChecking}
          onCheck={equivalenceChecking.check}
          onCancel={equivalenceChecking.cancel}
        />
      ) : (
        <>
          {equivalenceChecking.result && (
            <ResultPanel result={equivalenceChecking.result} />
          )}

          <Button
            width="100%"
            colorScheme="blue"
            variant={equivalenceChecking.result ? "outline" : "solid"}
            onClick={equivalenceChecking.activate}
          >
            {equivalenceChecking.result
              ? "Check another pair"
              : "Select circuits to compare"}
          </Button>
        </>
      )}
    </VStack>
  );
}

interface SelectionPanelProps {
  selectedNodeCount: number;
  canCheck: boolean;
  isChecking: boolean;
  onCheck: () => void;
  onCancel: () => void;
}

function SelectionPanel({
  selectedNodeCount,
  canCheck,
  isChecking,
  onCheck,
  onCancel,
}: SelectionPanelProps) {
  return (
    <Box
      padding="4"
      borderWidth="1px"
      borderColor="blue.200"
      borderRadius="lg"
      bg="blue.50"
      _dark={{ borderColor: "blue.700", bg: "blue.900" }}
    >
      <HStack justify="space-between">
        <Text fontWeight="semibold">
          {isChecking ? "Comparing circuits" : "Select two circuits"}
        </Text>
        <Badge colorScheme="blue" borderRadius="full" px="2">
          {selectedNodeCount} / 2
        </Badge>
      </HStack>

      <Progress
        value={selectedNodeCount}
        max={2}
        mt="3"
        size="sm"
        colorScheme="blue"
        borderRadius="full"
      />

      <Text mt="2" color="gray.600" fontSize="sm" _dark={{ color: "gray.300" }}>
        {isChecking
          ? "The selected OpenQASM inputs are being analyzed."
          : "Choose two compatible nodes in the problem graph."}
      </Text>

      <HStack mt="4" spacing="2">
        <Button
          flex="1"
          size="sm"
          colorScheme="blue"
          isDisabled={!canCheck}
          isLoading={isChecking}
          loadingText="Checking"
          onClick={onCheck}
        >
          Run check
        </Button>
        <Button
          size="sm"
          variant="ghost"
          isDisabled={isChecking}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </HStack>
    </Box>
  );
}

function ResultPanel({ result }: { result: EquivalenceCheckResponse }) {
  const presentation = STATUS_PRESENTATION[result.status];
  const hasDetails = Boolean(
    result.message || result.error || result.rawEquivalence,
  );

  return (
    <VStack align="stretch" spacing="3">
      <Alert
        status={presentation.alertStatus}
        variant="left-accent"
        alignItems="flex-start"
        borderRadius="md"
      >
        <AlertIcon mt="0.5" />
        <Box minWidth={0}>
          <AlertTitle fontSize="sm">{presentation.title}</AlertTitle>
          <AlertDescription display="block" fontSize="sm">
            {presentation.description}
          </AlertDescription>

          <HStack mt="3" spacing="2" flexWrap="wrap">
            <Badge colorScheme={presentation.colorScheme}>
              {formatStatus(result.status)}
            </Badge>
            {result.runtimeMs > 0 && (
              <Badge variant="subtle">{result.runtimeMs} ms</Badge>
            )}
            <Badge variant="subtle">MQT QCEC</Badge>
            {result.globalPhaseIgnored !== null && (
              <Badge variant="subtle">
                Global phase{" "}
                {result.globalPhaseIgnored ? "ignored" : "considered"}
              </Badge>
            )}
          </HStack>
        </Box>
      </Alert>

      {hasDetails && <ResultDetails result={result} />}
    </VStack>
  );
}

function ResultDetails({ result }: { result: EquivalenceCheckResponse }) {
  return (
    <Accordion allowToggle>
      <AccordionItem border="0">
        <AccordionButton
          px="0"
          py="2"
          borderRadius="md"
          _hover={{ bg: "blackAlpha.50" }}
          _dark={{ _hover: { bg: "whiteAlpha.100" } }}
        >
          <Box
            as="span"
            flex="1"
            textAlign="left"
            fontSize="sm"
            fontWeight="medium"
          >
            View response details
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel px="0" pt="2" pb="0">
          <VStack align="stretch" spacing="3">
            {result.message && (
              <Box>
                <Text mb="1" color="gray.500" fontSize="xs" fontWeight="bold">
                  MESSAGE
                </Text>
                <Text fontSize="sm">{result.message}</Text>
              </Box>
            )}

            {result.error && (
              <Box>
                <Text mb="1" color="gray.500" fontSize="xs" fontWeight="bold">
                  ERROR
                </Text>
                <Code
                  display="block"
                  width="100%"
                  padding="2"
                  borderRadius="md"
                  whiteSpace="pre-wrap"
                  fontSize="xs"
                >
                  {result.error.type}: {result.error.message}
                </Code>
              </Box>
            )}

            {result.rawEquivalence && (
              <Box>
                <Text mb="1" color="gray.500" fontSize="xs" fontWeight="bold">
                  RAW RESULT
                </Text>
                <Code
                  display="block"
                  width="100%"
                  padding="2"
                  borderRadius="md"
                  whiteSpace="pre-wrap"
                  fontSize="xs"
                >
                  {result.rawEquivalence}
                </Code>
              </Box>
            )}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function formatStatus(status: EquivalenceCheckStatus) {
  return status.replaceAll("_", " ");
}
