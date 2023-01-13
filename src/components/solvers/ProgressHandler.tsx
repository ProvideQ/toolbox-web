import React, { useState } from "react";
import { GoButton } from "./buttons/GoButton";
import { postProblem } from "../../api/ToolboxAPI";
import {ProgressView} from "./ProgressView";
import { Container } from "../Container";
import {Solution} from "./Solution";

export interface ProgressHandlerProps {
    problemType: string;
    problemInput: any;
}

export const ProgressHandler = (props: ProgressHandlerProps) => {
    const [wasClicked, setClicked] = useState(false);
    const [finished, setFinished] = useState(false);
    const [solution, setSolution] = useState<Solution>();

    async function onGoClicked() {
        setClicked(true);
        setFinished(false);
        let solution = await postProblem(props.problemType, props.problemInput);
        setSolution(solution);
        setFinished(true);
    }

    return (
        <Container>
            {wasClicked
                ? <ProgressView solution={solution} finished={finished}/>
                : null}
            {!wasClicked || finished
                ? <GoButton clicked={onGoClicked}/>
                : null}
        </Container>
    );
}