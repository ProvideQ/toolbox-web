import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { ProblemDto } from "../../../api/data-model/ProblemDto";
import { ProblemState } from "../../../api/data-model/ProblemState";
import { SolutionView } from "../SolutionView";
import { useSolvers } from "./SolverProvider";

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
    <AccordionItem>
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

export const ProblemDetails = (props: { problemDto: ProblemDto<any> }) => {
  const { solvers, getSolvers } = useSolvers();

  // Update solvers in case they are not loaded yet
  if (!solvers[props.problemDto.typeId]) getSolvers(props.problemDto.typeId);

  return (
    <VStack gap="20px" align="start">
      <Textarea readOnly resize="vertical" value={props.problemDto.input} />
      <Text>
        <b>Status:</b> {getHumanReadableState(props.problemDto.state)}
      </Text>
      <Text>
        <b>Solver:</b>{" "}
        {solvers[props.problemDto.typeId]?.find(
          (s) => s.id === props.problemDto.solverId
        )?.name ?? "-"}
      </Text>
      {props.problemDto.subProblems.length === 0 ? (
        <b>No subroutines</b>
      ) : (
        <VStack width="100%" align="stretch">
          <Text>Sub Routines:</Text>
          <Accordion>
            {props.problemDto.subProblems.map((subProblem) =>
              getAccordionItem(
                subProblem.subRoutine.typeId,
                subProblem.subRoutine.description
              )
            )}
          </Accordion>
        </VStack>
      )}
      {props.problemDto.solution !== null && (
        <SolutionView solution={props.problemDto.solution} />
      )}
    </VStack>
  );
};
