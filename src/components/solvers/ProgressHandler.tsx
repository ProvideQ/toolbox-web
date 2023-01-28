import React, {useState} from "react";
import {GoButton} from "./buttons/GoButton";
import {postProblem} from "../../api/ToolboxAPI";
import {ProgressView} from "./ProgressView";
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
    const [solverPicked, setSolverPicked] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const [solution, setSolution] = useState<Solution>();

    async function onGoClicked() {
        setClicked(true);
        setSolverPicked(false);
        setFinished(false);
    }

    async function startSolving(solver: ProblemSolver | undefined) {
        setSolverPicked(true);

        postProblem(props.problemType, props.problemInput, solver)
            .then(solution => {
                setSolution(solution);
                setFinished(true);
            });
    }

    return (
        <Container>
            {!wasClicked || finished
                ? <GoButton clicked={onGoClicked}/>
                : null}
            {wasClicked && !solverPicked
                ? <SolverPicker problemType={props.problemType} onSolverPicked={startSolving}/>
                : null}
            {wasClicked && solverPicked
                ? <ProgressView solution={solution} finished={finished}/>
                : null}
        </Container>
    );
}