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
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { BsDatabaseFillGear } from "react-icons/bs";
import { ProblemDto } from "../../../api/toolbox/data-model/ProblemDto";
import { ProblemState } from "../../../api/toolbox/data-model/ProblemState";
import { SettingsView } from "../settings/SettingsView";
import { SolutionView } from "../SolutionView";
import { useGraphUpdates } from "./ProblemGraphView";
import { useSolvers } from "./SolverProvider";

interface Props {
  problemDto: ProblemDto<any>;
}

interface StatePresentation {
  alertStatus: AlertStatus;
  label: string;
  description: string;
  colorScheme: string;
}

const STATE_PRESENTATION: Record<ProblemState, StatePresentation> = {
  [ProblemState.NEEDS_CONFIGURATION]: {
    alertStatus: "warning",
    label: "Needs configuration",
    description: "Configure the solver before starting this problem.",
    colorScheme: "orange",
  },
  [ProblemState.READY_TO_SOLVE]: {
    alertStatus: "info",
    label: "Ready to solve",
    description: "The problem is configured and ready to be solved.",
    colorScheme: "blue",
  },
  [ProblemState.SOLVING]: {
    alertStatus: "info",
    label: "Solving",
    description: "The selected solver is currently processing this problem.",
    colorScheme: "purple",
  },
  [ProblemState.SOLVED]: {
    alertStatus: "success",
    label: "Solved",
    description: "The solver has produced a result for this problem.",
    colorScheme: "green",
  },
};

export const ProblemDetails = ({ problemDto }: Props) => {
  const { solvers, getSolvers } = useSolvers();
  const { updateProblem } = useGraphUpdates();

  // Update solvers in case they are not loaded yet
  if (!solvers[problemDto.typeId]) getSolvers(problemDto.typeId);

  const solver = solvers[problemDto.typeId]?.find(
    (candidate) => candidate.id === problemDto.solverId,
  );
  const statePresentation = STATE_PRESENTATION[problemDto.state];

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
          <BsDatabaseFillGear size="1.15rem" />
        </Flex>

        <Box minWidth={0}>
          <Heading as="h4" size="md">
            Problem Details
          </Heading>
          <Text
            mt="1"
            color="gray.600"
            fontSize="sm"
            fontWeight="medium"
            _dark={{ color: "gray.400" }}
          >
            {getHumanReadableTypeId(problemDto.typeId)}
          </Text>
          <Text
            mt="0.5"
            color="gray.500"
            fontFamily="mono"
            fontSize="xs"
            noOfLines={1}
            title={problemDto.id}
          >
            {problemDto.id}
          </Text>
        </Box>
      </HStack>

      <Divider />

      <Alert
        status={statePresentation.alertStatus}
        variant="left-accent"
        alignItems="flex-start"
        borderRadius="md"
      >
        <AlertIcon mt="0.5" />
        <Box minWidth={0}>
          <AlertTitle fontSize="sm">{statePresentation.label}</AlertTitle>
          <AlertDescription display="block" fontSize="sm">
            {statePresentation.description}
          </AlertDescription>

          <HStack mt="3" spacing="2" flexWrap="wrap">
            <Badge colorScheme={statePresentation.colorScheme}>
              {statePresentation.label}
            </Badge>
            <Badge variant="subtle">
              {solver?.name ?? "No solver selected"}
            </Badge>
            <Badge variant="subtle">
              {problemDto.subProblems.length}{" "}
              {problemDto.subProblems.length === 1
                ? "subroutine"
                : "subroutines"}
            </Badge>
          </HStack>
        </Box>
      </Alert>

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
        <Textarea
          readOnly
          minHeight="7rem"
          resize="vertical"
          value={String(problemDto.input ?? "")}
          bg="blackAlpha.50"
          borderColor="blackAlpha.200"
          borderRadius="md"
          fontFamily="mono"
          fontSize="sm"
          _dark={{
            bg: "whiteAlpha.50",
            borderColor: "whiteAlpha.300",
          }}
        />
      </Box>

      {solver && (
        <DetailSection
          title="Solver settings"
          badge={solver.name}
          defaultOpen={problemDto.state === ProblemState.NEEDS_CONFIGURATION}
        >
          <SettingsView
            problemDto={problemDto}
            settingsChanged={() => updateProblem(problemDto.id)}
          />
        </DetailSection>
      )}

      {problemDto.subProblems.length > 0 && (
        <DetailSection
          title="Subroutines"
          badge={String(problemDto.subProblems.length)}
        >
          <Accordion allowMultiple width="100%">
            {problemDto.subProblems.map((subProblem, index) => (
              <AccordionItem
                key={`${subProblem.subRoutine.typeId}-${index}`}
                borderTopWidth={index === 0 ? "0" : "1px"}
                borderBottomWidth="0"
              >
                <AccordionButton px="0" py="3">
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {getHumanReadableTypeId(subProblem.subRoutine.typeId)}
                  </Box>
                  <Badge mr="2" variant="subtle">
                    {subProblem.subProblemIds.length}
                  </Badge>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel px="0" pt="1" pb="3">
                  <Text
                    color="gray.600"
                    fontSize="sm"
                    _dark={{ color: "gray.300" }}
                  >
                    {subProblem.subRoutine.description}
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </DetailSection>
      )}

      {problemDto.solution !== null && (
        <DetailSection title="Solution" badge={problemDto.solution.status}>
          <Box
            sx={{
              "& > .chakra-accordion": {
                marginTop: 0,
              },
            }}
          >
            <SolutionView solution={problemDto.solution} />
          </Box>
        </DetailSection>
      )}

      {problemDto.error && (
        <DetailSection title="Problem error" badge="Error">
          <Text color="red.600" fontSize="sm" _dark={{ color: "red.300" }}>
            {problemDto.error}
          </Text>
        </DetailSection>
      )}
    </VStack>
  );
};

interface DetailSectionProps {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

function DetailSection({
  title,
  badge,
  defaultOpen = false,
  children,
}: DetailSectionProps) {
  return (
    <Accordion allowToggle defaultIndex={defaultOpen ? 0 : undefined}>
      <AccordionItem
        borderWidth="1px"
        borderColor="blackAlpha.200"
        borderRadius="lg"
        overflow="hidden"
        _dark={{ borderColor: "whiteAlpha.300" }}
      >
        <AccordionButton
          px="4"
          py="3"
          _hover={{ bg: "blackAlpha.50" }}
          _dark={{ _hover: { bg: "whiteAlpha.100" } }}
        >
          <Box
            as="span"
            flex="1"
            textAlign="left"
            fontSize="sm"
            fontWeight="semibold"
          >
            {title}
          </Box>
          {badge && (
            <Badge
              mr="2"
              maxWidth="9rem"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {badge}
            </Badge>
          )}
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel
          px="4"
          pt="3"
          pb="4"
          borderTopWidth="1px"
          borderColor="blackAlpha.100"
          _dark={{ borderColor: "whiteAlpha.200" }}
        >
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function getHumanReadableTypeId(typeId: string) {
  return typeId.replaceAll(/([a-z])([A-Z])/g, "$1 $2");
}
