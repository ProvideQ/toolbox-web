import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { Handle, NodeProps, Position } from "reactflow";
import { ProblemSolverInfo } from "../../../api/data-model/ProblemSolverInfo";

export interface SolverNodeData {
  problemTypeId: string;
  problemSolver: ProblemSolverInfo;
  selectCallback: (problemSolver: ProblemSolverInfo) => void;
}

export function SolverNode(props: NodeProps<SolverNodeData>) {
  const [selected, setSelected] = useState(false);

  return (
    <Box
      border="1px"
      borderRadius="10px"
      padding=".5rem"
      background={selected ? "green" : "kitGreen"}
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
        <HStack align="start" maxW="10rem">
          <Tooltip hasArrow label="Solver" placement="bottom">
            <div>
              <FaGears size="2rem" />
            </div>
          </Tooltip>
          <Text padding=".5rem" fontWeight="semibold">
            {props.data.problemSolver.name}
          </Text>

          <Popover>
            <PopoverTrigger>
              <div>
                <FaQuestionCircle size="1rem" />
              </div>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                  <Text fontWeight="semibold">
                    {props.data.problemSolver.name}
                  </Text>
                </PopoverHeader>
                <PopoverBody>
                  <Text>Solves {props.data.problemTypeId}</Text>
                  Additional Info:
                  <Button colorScheme="blue">10x Quantum Speedup</Button>
                </PopoverBody>
                <PopoverFooter>
                  <Text fontSize="xs">{props.data.problemSolver.id}</Text>
                </PopoverFooter>
              </PopoverContent>
            </Portal>
          </Popover>
        </HStack>
        <Text
          background="transparent"
          className="hover:#AAAAAAAA"
          border="1px"
          borderRadius="0.25rem"
          paddingX="2rem"
          paddingY="1px"
          onClick={() => {
            props.data.selectCallback(props.data.problemSolver);
            setSelected(true);
          }}
        >
          Select
        </Text>
      </VStack>
    </Box>
  );
}
