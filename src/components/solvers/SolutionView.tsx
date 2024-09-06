import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Code,
} from "@chakra-ui/react";
import { SolutionObject } from "../../api/data-model/SolutionObject";

export interface SolutionViewProps {
  solution: SolutionObject;
}

const OutputSection = (props: { title: string; content: any[] }) => (
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box as="span" flex="1" textAlign="left">
          {props.title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    {props.content.map((contentChunk, chunkIndex) => {
      return (
        <AccordionPanel pb="4" key={chunkIndex}>
          {contentChunk !== null && contentChunk !== undefined ? (
            <Code width="100%" padding="1rem">
              <pre style={{ overflowX: "auto" }}>
                {typeof contentChunk === "string" ||
                contentChunk instanceof String
                  ? contentChunk
                  : JSON.stringify(contentChunk, null, "\t")}
              </pre>
            </Code>
          ) : (
            <i>No {props.title} output!</i>
          )}
        </AccordionPanel>
      );
    })}
  </AccordionItem>
);

export const SolutionView = (props: SolutionViewProps) => (
  <Accordion defaultIndex={[0]} width="100%" marginTop="2rem" allowMultiple>
    <OutputSection
      title={`Solution by ${props.solution.solverName}`}
      content={[props.solution.solutionData]}
    />
    <OutputSection
      title="Meta Data"
      content={[
        `Problem ID: ${props.solution.id}`,
        `Solver: ${props.solution.solverName}`,
        `Execution time: ${props.solution.executionMilliseconds / 1000}s`,
        `Additional meta data: ${props.solution.metaData}`,
      ]}
    />
    <OutputSection
      title="Debugging Info"
      content={[props.solution.debugData]}
    />
    {/*<OutputSection title="Error" content={[props.solution.error]} />*/}
  </Accordion>
);
