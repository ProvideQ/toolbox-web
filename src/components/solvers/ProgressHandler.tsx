import { Box, Center, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { GoButton } from "./buttons/GoButton";
import { postProblem } from "../../api/ToolboxAPI";
import { SolutionView } from "./SolutionView";
import { Container } from "../Container";
import { Solution } from "../../api/data-model/Solution";
import { SolveRequest } from "../../api/data-model/SolveRequest";
import { SolverPicker } from "./SolverPicker";

export interface ProgressHandlerProps<T> {
  /**
   * List of problem types that should be solved with the given input.
   */
  problemTypes: string[];
  problemInput: T;
}

export const ProgressHandler = <T extends {}>(
  props: ProgressHandlerProps<T>
) => {
  const [wasClicked, setClicked] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [solutions, setSolutions] = useState<Solution[]>();
  const [solveRequest, setSolveRequest] = useState<SolveRequest<T>>({
    requestContent: props.problemInput,
    requestedSubSolveRequests: {},
  });

  async function startSolving() {
    setClicked(true);
    setFinished(false);

    let newSolveRequest: SolveRequest<T> = {
      ...solveRequest,
      requestContent: props.problemInput,
    };

    setSolveRequest(newSolveRequest);
    Promise.all(
      props.problemTypes.map(problemType => postProblem(problemType, newSolveRequest))
    ).then(solutions => {
      setSolutions(solutions);
      setFinished(true);
    });
  }

  return (
    <Container>
      {!wasClicked || finished ? (
        <VStack>
          <Center>
            <GoButton clicked={startSolving} />
          </Center>
          {props.problemTypes.map(problemType => <SolverPicker
            key={problemType}
            problemUrlFragment={problemType}
            setSolveRequest={solverChoice => {
              setSolveRequest({
                ...solveRequest,
                requestedSolverId: solverChoice.requestedSolverId,
                requestedSubSolveRequests:
                  solveRequest.requestedSubSolveRequests
              })
            }}
          />)}
        </VStack>
      ) : null}

      {wasClicked
        ? solutions?.map((s) => (
            <Box
              key={`${s.solverName}-${s.id}`}
              w="50pc"
              m={2}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={2}
            >
              <SolutionView key={s.id} solution={s} finished={finished} />
            </Box>
          ))
        : null}
    </Container>
  );
};
