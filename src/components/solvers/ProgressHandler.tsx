import { Box, Center, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { GoButton } from "./buttons/GoButton";
import { postProblem } from "../../api/ToolboxAPI";
import { SolutionView } from "./SolutionView";
import { Container } from "../Container";
import { Solution } from "./Solution";
import { SolveRequest } from "./SolveRequest";
import { SolverPicker } from "./SolverPicker";

export interface ProgressHandlerProps<T> {
    /**
     * List of url fragments that are used for problem solve request to the toolbox.
     */
    explicitSolvers?: string[];
    /**
     * Url to retrieve solver candidates.
     * Also used for sending the problem solve request to the toolbox unless explicitSolvers is set,
     * in which case this is used to send problem solve request.
     */
    problemUrlFragment: string;
    problemInput: T;
}

export const ProgressHandler = <T extends {}>(props: ProgressHandlerProps<T>) => {
    const [wasClicked, setClicked] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const [solutions, setSolutions] = useState<Solution[]>();
    const [solveRequest, setSolveRequest] = useState<SolveRequest<T>>({
        requestContent: props.problemInput,
        requestedSubSolveRequests: {}
    });

    async function startSolving() {
        setClicked(true);
        setFinished(false);

        let newSolveRequest : SolveRequest<T> = {
            requestContent: props.problemInput,
            requestedSolverId: solveRequest.requestedSolverId,
            requestedMetaSolverSettings: solveRequest.requestedMetaSolverSettings,
            requestedSubSolveRequests: solveRequest.requestedSubSolveRequests
        }

        setSolveRequest(newSolveRequest);
        if (props.explicitSolvers == undefined) {
            postProblem(props.problemUrlFragment, newSolveRequest)
                .then(solution => {
                    setSolutions([solution]);
                    setFinished(true);
                });
        } else {
            Promise.all(props.explicitSolvers.map(s => postProblem(s, newSolveRequest)))
                .then(solutions => {
                    setSolutions(solutions);
                    setFinished(true);
                });
        }
    }

    return (
        <Container>
            {!wasClicked || finished
                ? (
                    <VStack>
                        <Center>
                            <GoButton clicked={startSolving}/>
                        </Center>
                        <SolverPicker problemUrlFragment={props.problemUrlFragment}
                                      setSolveRequest={solverChoice => {
                                          setSolveRequest({
                                              requestContent: props.problemInput,
                                              requestedSolverId: solverChoice.requestedSolverId,
                                              requestedMetaSolverSettings: solveRequest.requestedMetaSolverSettings,
                                              requestedSubSolveRequests: solverChoice.requestedSubSolveRequests
                                          });
                                      }}/>
                    </VStack>
                )
                : null}

            {wasClicked
                ? solutions?.map(s => (
                    <Box key={s.id} w="50pc" m={2} borderWidth="1px" borderRadius="lg" overflow="hidden" p={2}>
                        <SolutionView key={s.id} solution={s} finished={finished}/>
                    </Box>)
                )
                : null}
        </Container>
    );
}
