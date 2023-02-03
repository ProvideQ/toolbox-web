import {HStack} from "@chakra-ui/react";
import React, {useState} from "react";
import {GoButton} from "./buttons/GoButton";
import {postProblem} from "../../api/ToolboxAPI";
import {SolutionView} from "./SolutionView";
import {Container} from "../Container";
import {Solution} from "./Solution";
import {SolverPicker} from "./SolverPicker";
import {ProblemSolver} from "./ProblemSolver";

export interface ProgressHandlerProps {
    problemType: string;
    problemInput: any;
}

export const ProgressHandler = (props: ProgressHandlerProps) => {
    const [wasClicked, setClicked] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const [solution, setSolution] = useState<Solution>();
    const [solver, setSolver] = useState<ProblemSolver | undefined>(undefined);

    async function startSolving() {
        setClicked(true);
        setFinished(false);

        postProblem(props.problemType, props.problemInput, solver)
            .then(solution => {
                setSolution(solution);
                setFinished(true);
                setSolver(undefined);
            });
    }

    return (
        <Container>
            {!wasClicked || finished
                ? (
                    <HStack>
                        <SolverPicker problemType={props.problemType} setSolver={solver => setSolver(solver)}/>
                        <GoButton clicked={startSolving}/>
                    </HStack>
                )

                : null}
            {wasClicked
                ? <SolutionView solution={solution} finished={finished}/>
                : null}
        </Container>
    );
}