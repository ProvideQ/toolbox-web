import { Button, Flex, HStack, Link, Tooltip } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { FaPlay } from "react-icons/fa6";
import { getInvalidProblemDto } from "../../api/toolbox/data-model/ProblemDto";
import { toolboxApi } from "../../api/toolbox/ToolboxAPI";
import { StrategyProvider } from "./Graph/MetaSolverStrategyProvider";
import { ProblemGraphView } from "./Graph/ProblemGraphView";
import { SolverProvider } from "./Graph/SolverProvider";

interface SolverConfigurationProps {
  problemTypeId: string;
  problemTypeName?: string;
  problemInput: string;
}

export const SolverConfiguration = (props: SolverConfigurationProps) => {
  const [problemId, setProblemId] = useState<string | null>(null);
  const [isEditorReachable, setIsEditorReachable] = useState(true);
  const problemGraphViewRef = useRef<HTMLDivElement>(null);

  // Reset problemId when problemInput is empty
  useEffect(() => {
    if (props.problemInput === "") {
      // Defer to avoid synchronous setState inside an effect
      setTimeout(() => setProblemId(null), 0);
    }
  }, [props.problemInput]);

  useEffect(() => {
    if (problemGraphViewRef.current) {
      problemGraphViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [problemId]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_MSS_EDITOR_BASE_URL ?? "";
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(() => setIsEditorReachable(true))
      .catch(() => setIsEditorReachable(false));
    return () => controller.abort();
  }, []);

  return (
    <Flex alignSelf="center">
      {problemId === null ? (
        <HStack>
          <Tooltip label="Interactively configure and solve this problem using a selection of various solvers.">
            <Button
              bg="kitGreen"
              textColor="white"
              size="md"
              gap="5px"
              onClick={() => {
                toolboxApi
                  .postProblem<string>(props.problemTypeId, {
                    ...getInvalidProblemDto<string>(),
                    input: props.problemInput,
                  })
                  .then((problem) => {
                    setProblemId(problem.id);
                  });
              }}
            >
              <FaPlay />
              Configure {props.problemTypeName ?? props.problemTypeId} Solver
            </Button>
          </Tooltip>

          {isEditorReachable && (
            <Tooltip label="Create and save a strategy what solvers to use.">
              <Link
                href={process.env.NEXT_PUBLIC_MSS_EDITOR_BASE_URL}
                target="_blank"
              >
                <Button bg="kitBlue" textColor="white" size="md" gap="5px">
                  <BsArrowUpRight />
                  Go to Strategy Editor
                </Button>
              </Link>
            </Tooltip>
          )}
        </HStack>
      ) : (
        <SolverProvider>
          <StrategyProvider>
            <div ref={problemGraphViewRef}>
              <ProblemGraphView
                problemTypeId={props.problemTypeId}
                problemId={problemId}
              />
            </div>
          </StrategyProvider>
        </SolverProvider>
      )}
    </Flex>
  );
};
