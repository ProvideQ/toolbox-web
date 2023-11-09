import { Box, Center, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { History } from "./History";
import { GoButton } from "./buttons/GoButton";
import { fetchSolution, postProblem } from "../../api/ToolboxAPI";
import { SolutionView } from "./SolutionView";
import { Container } from "../Container";
import { Solution } from "../../api/data-model/Solution";
import { SolveRequest } from "../../api/data-model/SolveRequest";
import { SolverPicker } from "./SolverPicker";

export interface ProblemState<T> {
  /**
   * Problem input
   */
  content: T;
  /**
   * Ids of the solutions of the problem input per problem type
   */
  solutionIds: ProblemTypeSolutionId;
}

export type ProblemTypeSolutionId = {
  [problemTypeId: string]: number;
};

export interface ProgressHandlerProps<T> {
  /**
   * List of problem types that should be solved with the given input.
   */
  problemTypes: string[];
  problemInput: T;
  setProblemInput: (t: T) => void;
}

export const ProgressHandler = <T extends {}>(
  props: ProgressHandlerProps<T>
) => {
  const historyCookieName: string = `problemStates-${props.problemTypes}`;

  const [wasClicked, setClicked] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [solutions, setSolutions] = useState<Solution[]>();
  const [problemStates, setProblemStates] = useState<ProblemState<T>[]>([]);
  const [solveRequest, setSolveRequest] = useState<SolveRequest<T>>({
    requestContent: props.problemInput,
    requestedSubSolveRequests: {},
  });
  const [cookies, setCookies] = useCookies([historyCookieName]);

  useEffect(() => {
    // Handle problem states cookies
    if (problemStates.length == 0 && cookies[historyCookieName]?.length > 0) {
      setProblemStates(cookies[historyCookieName]);
    }
  }, [problemStates, cookies, historyCookieName]);

  useEffect(() => {
    setCookies(historyCookieName, problemStates);
  }, [historyCookieName, problemStates, setCookies]);

  async function getSolution() {
    setClicked(true);
    setFinished(false);

    // Check if the problem was previously solved
    let existingProblem = problemStates.find(
      (state) => state.content == props.problemInput
    );
    if (existingProblem !== undefined) {
      await loadSolution(existingProblem.solutionIds);
    } else {
      await startSolving();
    }
  }

  async function startSolving() {
    let newSolveRequest: SolveRequest<T> = {
      ...solveRequest,
      requestContent: props.problemInput,
    };

    setSolveRequest(newSolveRequest);
    Promise.all(
      props.problemTypes.map((problemType) =>
        postProblem(problemType, newSolveRequest).then((s) => ({
          problemType: problemType,
          solution: s,
        }))
      )
    ).then((result) => {
      let solutionIdMap = result.reduce((acc, item) => {
        acc[item.problemType] = item.solution.id;
        return acc;
      }, {} as ProblemTypeSolutionId);

      let newProblemState: ProblemState<T> = {
        content: props.problemInput,
        solutionIds: solutionIdMap,
      };

      setSolutions(result.map((x) => x.solution));
      setProblemStates([...problemStates, newProblemState]);
      setFinished(true);
    });
  }

  async function loadSolution(ids: ProblemTypeSolutionId) {
    setClicked(true);
    setFinished(false);

    Promise.all(
      props.problemTypes.map((problemType) =>
        fetchSolution(problemType, ids[problemType])
      )
    ).then((solutions) => {
      setSolutions(solutions);
      setFinished(true);
    });
  }

  return (
    <Container>
      {!wasClicked || finished ? (
        <HStack alignContent={"end"}>
          {props.problemTypes.map((problemType) => (
            <SolverPicker
              key={problemType}
              problemType={problemType}
              setSolveRequest={(solverChoice) => {
                setSolveRequest({
                  ...solveRequest,
                  requestedSolverId: solverChoice.requestedSolverId,
                  requestedSubSolveRequests:
                    solveRequest.requestedSubSolveRequests,
                });
              }}
            />
          ))}
          <Center>
            <GoButton clicked={getSolution} />
          </Center>
        </HStack>
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

      <History
        problemStates={problemStates}
        loadSolution={loadSolution}
        setContent={props.setProblemInput}
      />
    </Container>
  );
};
