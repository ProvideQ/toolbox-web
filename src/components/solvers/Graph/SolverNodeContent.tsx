import { Button, HStack, Text, Tooltip, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaGears } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import { ProblemSolverInfo } from "../../../api/data-model/ProblemSolverInfo";
import { useGraphUpdates } from "./ProblemGraphView";

export interface SolverNodeContentProps {
  problemIds: string[];
  solver: ProblemSolverInfo;
  button: {
    label: ReactNode;
    callback?: () => void;
  };
}

export const SolverNodeContent = (props: SolverNodeContentProps) => {
  const { updateProblem } = useGraphUpdates();

  return (
    <VStack gap="0px">
      <HStack align="start" maxW="10rem" justifyContent="space-between" gap="0">
        <Tooltip hasArrow label="Solver" placement="bottom">
          <div>
            <FaGears size="2rem" />
          </div>
        </Tooltip>
        <Text padding=".25rem" fontWeight="semibold">
          {props.solver.name}
        </Text>

        {props.problemIds !== undefined && (
          <IoMdRefresh
            cursor="pointer"
            size="2rem"
            onClick={() => {
              for (let problemId of props.problemIds) {
                updateProblem(problemId);
              }
            }}
          />
        )}
      </HStack>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "0.5rem",
          width: "100%",
        }}
      >
        <Button
          bg="kitGreen"
          width="100%"
          height="25px"
          textColor="white"
          fontWeight="bold"
          fontSize="small"
          _hover={{
            bg: props.button.callback ? "kitGreenAlpha" : "kitGreen",
          }}
          border="1px"
          borderColor="black"
          borderRadius="0.25rem"
          paddingY="1px"
          onClick={props.button.callback}
        >
          {props.button.label}
        </Button>
      </div>
    </VStack>
  );
};
