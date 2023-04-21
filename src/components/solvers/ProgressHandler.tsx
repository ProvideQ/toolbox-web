import { Box, Center, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { GoButton } from "./buttons/GoButton";
import { postProblem } from "../../api/ToolboxAPI";
import { SolutionView } from "./SolutionView";
import { Container } from "../Container";
import { Solution } from "./Solution";
import { SolveRequest, SubSolveRequest } from "./SolveRequest";
import { SolverPicker } from "./SolverPicker";

export interface ProgressHandlerProps<T> {
    explicitSolvers?: string[];
    problemUrl: string;
    problemInput: T;
}

export const ProgressHandler = <T extends {}>(props: ProgressHandlerProps<T>) => {
    const [wasClicked, setClicked] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const [solutions, setSolutions] = useState<Solution[]>();
    const [solveRequest, setSolveRequest] = useState<SolveRequest<T>>({
        requestContent: props.problemInput,
        requestedSubSolveRequests: new Map<string, SubSolveRequest>()
    });

    async function startSolving() {
        setClicked(true);
        setFinished(false);

        solveRequest.requestContent = props.problemInput;
        if (props.explicitSolvers == undefined) {
            postProblem(props.problemUrl, solveRequest)
                .then(solution => {
                    setSolutions([solution]);
                    setFinished(true);
                });
        } else {
            Promise.all(props.explicitSolvers.map(s => postProblem(s, solveRequest)))
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
                        <SolverPicker problemUrl={props.problemUrl}
                                      setSolveRequest={solveRequest => setSolveRequest(solveRequest)}/>
                    </VStack>
                )
                : null}

            {wasClicked
                ? solutions?.map(s => (
                    <Box key={s.id} w="50pc"  m={2} borderWidth="1px" borderRadius="lg" overflow="hidden" p={2}>
                        <SolutionView key={s.id} solution={s} finished={finished}/>
                    </Box>)
                )
                : null}
        </Container>
    );
}
