import { Box, VStack } from "@chakra-ui/react";
import { Handle, NodeProps, Position } from "reactflow";
import { ProblemSolverInfo } from "../../../api/data-model/ProblemSolverInfo";
import { SolverNodeContent } from "./SolverNodeContent";

export interface SolverNodeData {
  problemId: string[];
  problemSolver: ProblemSolverInfo;
  selectCallback: (problemSolver: ProblemSolverInfo) => void;
}

export function SolverNode(props: NodeProps<SolverNodeData>) {
  return (
    <Box
      cursor="default"
      border="1px"
      borderRadius="10px"
      padding=".5rem"
      background="ghostwhite"
      fontSize="xs"
      css={{
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          borderBottomRightRadius: "5px",
          borderBottomLeftRadius: "5px",
          left: "50%",
          top: "-0.2px",
          width: "15px",
          height: "8px",
          background: "white",
          borderLeft: "1px solid black",
          borderRight: "1px solid black",
          borderBottom: "1px solid black",
          zIndex: 10,
        },
        "&::before": {
          transform: "translate(calc(-50% - 50px), -4%)",
        },
        "&::after": {
          transform: "translate(calc(-50% + 50px), -4%)",
        },
      }}
    >
      <Handle type="target" position={Position.Top} />
      <VStack gap="0px">
        <SolverNodeContent
          problemIds={props.data.problemId}
          solver={props.data.problemSolver}
          button={{
            label: "Select",
            callback: () => {
              props.data.selectCallback(props.data.problemSolver);
            },
          }}
        />
      </VStack>
    </Box>
  );
}
