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
import { ProblemDto } from "../../../api/data-model/ProblemDto";
import { ProblemSolverInfo } from "../../../api/data-model/ProblemSolverInfo";

export interface SolverNodeData {
  problemSolver: ProblemSolverInfo;
  problemDto: ProblemDto<any>;
  selectCallback: (problemSolver: ProblemSolverInfo) => void;
}

export function SolverNode(props: NodeProps<SolverNodeData>) {
  const [selected, setSelected] = useState(false);

  return (
    <Box
      border="1px"
      borderRadius="10px"
      padding=".5rem"
      background={selected ? "green" : "#00876CBE"}
      fontSize="xs"
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
                  <Text>Solves {props.data.problemDto.typeId}</Text>
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
