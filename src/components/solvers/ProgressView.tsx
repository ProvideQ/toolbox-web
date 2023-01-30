import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Code, Spinner, Text} from "@chakra-ui/react";
import {Container} from "../Container";
import {Solution} from "./Solution";

export interface ProgressViewProps {
    finished: boolean;
    solution: Solution | undefined;
}

const OutputSection = (props: { title: string, content: string }) => (
    <AccordionItem>
        <h2>
            <AccordionButton>
                <Box as="span" flex="1" textAlign="left">{ props.title }</Box>
                <AccordionIcon/>
            </AccordionButton>
        </h2>
        <AccordionPanel pb="4">
            { (props.content !== null && props.content !== undefined && props.content.trim() !== "")
                ? <Code width="100%" padding="1rem">{ props.content }</Code>
                : <i>No { props.title } output!</i>
            }
        </AccordionPanel>
    </AccordionItem>
)

export const ProgressView = (props: ProgressViewProps) => {
    if (props.finished && props.solution) {
        return (
            <Accordion defaultIndex={[0]} width="100%" marginTop="2rem">
                <OutputSection title={`Solution by ${props.solution.solverName}`} content={props.solution.solutionData} />
                <OutputSection title="Meta Data" content={props.solution.metaData} />
                <OutputSection title="Debugging Info" content={props.solution.debugData} />
                <OutputSection title="Error" content={props.solution.error} />
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