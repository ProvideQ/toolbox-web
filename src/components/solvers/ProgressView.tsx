import React from "react";
import {Spinner, Text} from "@chakra-ui/react";
import {Container} from "../Container";
import {Solution} from "./Solution";

export interface ProgressViewProps {
    finished: boolean;
    solution: Solution | undefined;
}

export const ProgressView = (props: ProgressViewProps) => {
    if (props.finished && props.solution) {
        return (
            <Container>
                {(props.solution.solutionData) && <Text>Solution: {props.solution.solutionData}</Text>}
                {(props.solution.metaData) && <Text>Meta Data: {props.solution.metaData}</Text>}
                {(props.solution.debugData) && <Text>Debug: {props.solution.debugData}</Text>}
                {(props.solution.error) && <Text>Error: {props.solution.error}</Text>}
            </Container>
        );
    } else {
        return (
            <Container>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='teal.500'
                    size='xl'/>
            </Container>
        );
    }
}