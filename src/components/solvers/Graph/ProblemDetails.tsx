import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { ProblemDto } from "../../../api/toolbox/data-model/ProblemDto";
import { ProblemState } from "../../../api/toolbox/data-model/ProblemState";
import { SettingsView } from "../settings/SettingsView";
import { SolutionView } from "../SolutionView";
import { useGraphUpdates } from "./ProblemGraphView";
import { useSolvers } from "./SolverProvider";

interface Props {
  problemDto: ProblemDto<any>;
}

function getHumanReadableState(state: ProblemState) {
  switch (state) {
    case ProblemState.NEEDS_CONFIGURATION:
      return "Needs Configuration";
    case ProblemState.READY_TO_SOLVE:
      return "Ready to Solve";
    case ProblemState.SOLVING:
      return "Solving";
    case ProblemState.SOLVED:
      return "Solved";
  }
}

function getAccordionItem(label: string, content: ReactNode) {
  return (
    <AccordionItem key={label}>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {label}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb="4">{content}</AccordionPanel>
    </AccordionItem>
  );
}

export const ProblemDetails = ({ problemDto }: Props) => {
  const { solvers, getSolvers } = useSolvers();
  const { updateProblem } = useGraphUpdates();

  // Update solvers in case they are not loaded yet
  if (!solvers[problemDto.typeId]) getSolvers(problemDto.typeId);

  const solver = solvers[problemDto.typeId]?.find(
    (s) => s.id === problemDto.solverId,
  );

  return (
    <VStack gap="20px" align="start">
      <Heading as="h4" size="md">
        Problem Details
      </Heading>

      <Textarea readOnly resize="vertical" value={problemDto.input} />
      <Text>
        <b>Status:</b> {getHumanReadableState(problemDto.state)}
      </Text>
      <Text>
        <b>Solver:</b> {solver?.name ?? "-"}
      </Text>
      {solver && (
        <VStack width="100%" align="stretch">
          <Text fontWeight="bold">Solver Settings:</Text>
          <SettingsView
            problemDto={problemDto}
            settingsChanged={(settings) => {
              updateProblem(problemDto.id);
            }}
          />
        </VStack>
      )}
      {problemDto.subProblems.length === 0 ? (
        <b>No subroutines</b>
      ) : (
        <VStack width="100%" align="stretch">
          <Text fontWeight="bold">Sub Routines:</Text>
          <Accordion>
            {problemDto.subProblems.map((subProblem) =>
              getAccordionItem(
                subProblem.subRoutine.typeId,
                subProblem.subRoutine.description,
              ),
            )}
          </Accordion>
        </VStack>
      )}
      {problemDto.solution !== null && (
        <VStack width="100%" align="stretch">
          <Text fontWeight="bold">Solution:</Text>
          <SolutionView solution={problemDto.solution} />
        </VStack>
      )}
    </VStack>
  );
};
