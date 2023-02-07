import React from "react";
import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Code, Spinner} from "@chakra-ui/react";
import {Container} from "../Container";
import {Solution} from "./Solution";

export interface SolutionViewProps {
    finished: boolean;
    solution: Solution | undefined;
}

const OutputSection = (props: { title: string, content: string[] }) => (
    <AccordionItem>
        <h2>
            <AccordionButton>
                <Box as="span" flex="1" textAlign="left">{ props.title }</Box>
                <AccordionIcon/>
            </AccordionButton>
        </h2>
        {props.content.map(c => {
            return (
                <AccordionPanel pb="4" key={c}>
                    {(c !== null && c !== undefined && c.trim() !== "")
                        ? <Code width="100%" padding="1rem">{c}</Code>
                        : <i>No {props.title} output!</i>
                    }
                </AccordionPanel>
            );
        })}
    </AccordionItem>
)

export const SolutionView = (props: SolutionViewProps) => {
    if (props.finished && props.solution) {
        return (
            <Accordion defaultIndex={[0]} width="100%" marginTop="2rem">
                <OutputSection title={`Solution by ${props.solution.solverName}`} content={[props.solution.solutionData]} />
                <OutputSection title="Meta Data" content={[
                    `Problem ID: ${props.solution.id}`,
                    `Solver: ${props.solution.solverName}`,
                    `Execution time: ${props.solution.executionMilliseconds / 1000}s`,
                    `Additional meta data: ${props.solution.metaData}`]} />
                <OutputSection title="Debugging Info" content={[props.solution.debugData]} />
                <OutputSection title="Error" content={[props.solution.error]} />
            </Accordion>
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