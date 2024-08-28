import { Button, Flex, Tooltip } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { getInvalidProblemDto } from "../../api/data-model/ProblemDto";
import { postProblem } from "../../api/ToolboxAPI";
import { ProblemGraphView } from "./Graph/ProblemGraphView";
import { SolverProvider } from "./Graph/SolverProvider";

interface SolverConfigurationProps {
  problemTypeId: string;
  problemTypeName?: string;
  problemInput: string;
}

export const SolverConfiguration = (props: SolverConfigurationProps) => {
  const [problemId, setProblemId] = useState<string | null>(null);
  const problemGraphViewRef = useRef<HTMLDivElement>(null);

  // Reset problemId when problemInput is empty
  useEffect(() => {
    if (props.problemInput === "") {
      setProblemId(null);
    }
  }, [props.problemInput]);

  useEffect(() => {
    if (problemGraphViewRef.current) {
      problemGraphViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [problemId]);

  return (
    <Flex alignSelf="center">
      {problemId === null ? (
        <Tooltip label="Unleash the Qubits!" color="white">
          <Button
            colorScheme="teal"
            size="md"
            onClick={() => {
              postProblem<string>(props.problemTypeId, {
                ...getInvalidProblemDto<string>(),
                input: props.problemInput,
              }).then((problem) => {
                setProblemId(problem.id);
              });
            }}
          >
            Configure {props.problemTypeName} Solver
          </Button>
        </Tooltip>
      ) : (
        <SolverProvider>
          <div ref={problemGraphViewRef}>
            <ProblemGraphView
              problemTypeId={props.problemTypeId}
              problemId={problemId}
            />
          </div>
        </SolverProvider>
      )}
    </Flex>
  );
};
