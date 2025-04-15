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
import { ReactNode, useState } from "react";
import { ProblemDto } from "../../../api/data-model/ProblemDto";
import { ProblemState } from "../../../api/data-model/ProblemState";
import { fetchProblemBounds } from "../../../api/ToolboxAPI";
import { SettingsView } from "../settings/SettingsView";
import { SolutionView } from "../SolutionView";
import { BoundDisplay } from "../VariableDependentDisplay";
import { useGraphUpdates } from "./ProblemGraphView";
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

export const ProblemDetails = (props: { problemDto: ProblemDto<any> }) => {
  const { solvers, getSolvers } = useSolvers();
  const { updateProblem } = useGraphUpdates();
  const [boundError, setBoundError] = useState(false);

  // Update solvers in case they are not loaded yet
  if (!solvers[props.problemDto.typeId]) getSolvers(props.problemDto.typeId);

  const solver = solvers[props.problemDto.typeId]?.find(
    (s) => s.id === props.problemDto.solverId
  );

  function getBound(problemTypeId: string, problemId: string) {
    fetchProblemBounds(problemTypeId, problemId).then((res) => {
      if (res.error) {
        setBoundError(true);
      } else {
        updateProblem(props.problemDto.id);
      }
    });
  }

  return (
    <VStack gap="20px" align="start">
      <Textarea readOnly resize="vertical" value={props.problemDto.input} />
      <Text>
        <b>Status:</b> {getHumanReadableState(props.problemDto.state)}
      </Text>
      <Text>
        <b>Solver:</b> {solver?.name ?? "-"}
      </Text>
      {solver && (
        <VStack width="100%" align="stretch">
          <Text fontWeight="bold">Solver Settings:</Text>
          <SettingsView
            problemDto={props.problemDto}
            settingsChanged={(settings) => {
              updateProblem(props.problemDto.id);
            }}
          />
        </VStack>
      )}
      <Text>
        <b>Bound: </b>{" "}
        {boundError ? (
          "Error fetching bound"
        ) : (
          <BoundDisplay
            buttonTitle="Get bound"
            variable={props.problemDto.bound}
            getter={() =>
              getBound(props.problemDto.typeId, props.problemDto.id)
            }
          />
        )}
      </Text>
      {props.problemDto.subProblems.length === 0 ? (
        <b>No subroutines</b>
      ) : (
        <VStack width="100%" align="stretch">
          <Text fontWeight="bold">Sub Routines:</Text>
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
        <VStack width="100%" align="stretch">
          <Text fontWeight="bold">Solution:</Text>
          <SolutionView problem={props.problemDto} />
        </VStack>
      )}
    </VStack>
  );
};
