import { Box, VStack } from "@chakra-ui/react";
import { Handle, NodeProps, Position } from "reactflow";
import { MetaSolverStrategyDto } from "../../../api/strategy/data-model/MetaSolverStrategyDto";
import { StrategyNodeContent } from "./StrategyNodeContent";

export interface StrategyNodeData {
  strategy: MetaSolverStrategyDto;
  selectCallback: (strategy: MetaSolverStrategyDto) => void;
}

export function StrategyNode(props: NodeProps<StrategyNodeData>) {
  return (
    <Box
      cursor="default"
      border="1px"
      borderRadius="10px"
      padding=".5rem"
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
      <VStack gap="0px" minWidth="120px">
        <StrategyNodeContent
          strategy={props.data.strategy}
          button={{
            label: "Select Strategy",
            callback: () => {
              props.data.selectCallback(props.data.strategy);
            },
          }}
        />
      </VStack>
    </Box>
  );
}
