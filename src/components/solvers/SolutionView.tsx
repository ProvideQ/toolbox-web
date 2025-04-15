import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Code,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ProblemDto } from "../../api/data-model/ProblemDto";
import {
  fetchProblemBoundComparison,
  fetchProblemBounds,
} from "../../api/ToolboxAPI";
import { useGraphUpdates } from "./Graph/ProblemGraphView";
import {
  BoundDisplay,
  VariableDependentDisplay,
} from "./VariableDependentDisplay";

export interface SolutionViewProps {
  problem: ProblemDto<any>;
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

const DictOutputSection = (props: {
  title: string;
  content: [string, any][];
}) => (
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
                {contentChunk[0] + ": "}
                {typeof contentChunk[1] === "string" ||
                contentChunk[1] instanceof String ||
                React.isValidElement(contentChunk[1])
                  ? contentChunk[1]
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

export const SolutionView = (props: SolutionViewProps) => {
  const { updateProblem } = useGraphUpdates();
  const [comparison, setComparison] = useState<number>();

  function getBound() {
    fetchProblemBounds(props.problem.typeId, props.problem.id).then((res) => {
      if (!res.error) {
        updateProblem(props.problem.id);
      }
    });
  }

  function getBoundComparison() {
    fetchProblemBoundComparison(props.problem.typeId, props.problem.id).then(
      (res) => {
        if (res) {
          setComparison(Math.round(res.comparison * 10000) / 10000);
        }
      }
    );
  }

  const ComparisonDisplay = () => {
    if (!props.problem.bound?.bound)
      return <Text>Estimate a bound first!</Text>;
    return (
      <VariableDependentDisplay
        buttonTitle={"Get Bound comparison"}
        variable={comparison}
        getter={() => getBoundComparison()}
      />
    );
  };

  return (
    <Accordion defaultIndex={[0]} width="100%" marginTop="2rem" allowMultiple>
      <OutputSection
        title={`Solution by ${props.problem.solution.solverName}`}
        content={[props.problem.solution.solutionData]}
      />
      <DictOutputSection
        title="Meta Data"
        content={[
          ["Solution ID", props.problem.solution.id],
          ["Solver", props.problem.solution.solverName],
          [
            "Execution time",
            (props.problem.solution.executionMilliseconds / 1000).toString(),
          ],
          [
            "Bound",
            <BoundDisplay
              key={"boundDisplay"}
              buttonTitle={"Get Bound"}
              variable={props.problem.bound}
              getter={() => getBound()}
            />,
          ],
          [
            "Bound compared to solution",
            <ComparisonDisplay key={"comparisonDisplay"} />,
          ],
          ["Additional meta data", props.problem.solution.metaData],
        ]}
      />
      <OutputSection
        title="Debugging Info"
        content={[props.problem.solution.debugData]}
      />
      {/*<OutputSection title="Error" content={[props.solution.error]} />*/}
    </Accordion>
  );
};
