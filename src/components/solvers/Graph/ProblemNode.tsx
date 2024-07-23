import {
  Box,
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Property } from "csstype";
import { useState } from "react";
import { BsDatabaseFillGear } from "react-icons/bs";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaQuestion,
  FaQuestionCircle,
} from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { GrInProgress } from "react-icons/gr";
import { ImCheckmark } from "react-icons/im";
import { MdError } from "react-icons/md";
import { Handle, NodeProps, Position } from "reactflow";
import { ProblemDto } from "../../../api/data-model/ProblemDto";
import { ProblemState } from "../../../api/data-model/ProblemState";
import { SolutionStatus } from "../../../api/data-model/SolutionStatus";
import { ProblemDetails } from "./ProblemDetails";
import { ProblemList } from "./ProblemList";
import { useSolvers } from "./SolverProvider";
import Color = Property.Color;

// Used to determine the horizontal position of the node in the canvas
export interface LevelInfo {
  /**
   * Index of the node at this level
   */
  index: number;
  /**
   * Total amount of nodes at this level
   */
  count: number;
}

export interface ProblemNodeData {
  // Data
  problemDtos: ProblemDto<any>[];

  // Styling info
  level: number;
  levelInfo: LevelInfo;

  // Callbacks
  solveCallback: (problem: ProblemDto<any>) => void;
}

function getNodeType(data: ProblemNodeData) {
  // Add input/output connect points for edges
  if (data.problemDtos.some((dto) => dto.solverId === undefined)) {
    if (data.level == 0) {
      return "input";
    } else {
      return "default";
    }
  } else {
    if (data.level === 0) {
      return "input";
    } else if (data.problemDtos.length == 0) {
      return "output";
    } else {
      return "default";
    }
  }
}

function getStatusColor(problemDtos: ProblemDto<any>[]): Color {
  for (let problemDto of problemDtos) {
    switch (problemDto.state) {
      case ProblemState.NEEDS_CONFIGURATION:
        return "ghostwhite";
      case ProblemState.SOLVED:
        switch (problemDto.solution.status) {
          case SolutionStatus.INVALID:
            return "orange";
          case SolutionStatus.ERROR:
            return "red";
        }
    }
  }

  // If all dtos are solved, the whole node should have the solved color
  if (problemDtos.every((dto) => dto.state === ProblemState.SOLVED)) {
    return "teal";
  }

  // Otherwise if any dto is ready to solve or solving, the whole node should have the ready to solve color
  return "cornflowerblue";
}

function getStatusIcon(problemDto: ProblemDto<any>): JSX.Element {
  switch (problemDto.state) {
    case ProblemState.NEEDS_CONFIGURATION:
      return <FaQuestion color="red" />;
    case ProblemState.READY_TO_SOLVE:
      return <ImCheckmark color="cornflowerblue" />;
    case ProblemState.SOLVING:
      return <Spinner speed="1s" width="10px" height="10px" thickness="1px" />;
    case ProblemState.SOLVED:
      switch (problemDto.solution.status) {
        case SolutionStatus.INVALID:
          return <MdError color="red" />;
        case SolutionStatus.COMPUTING:
          return <GrInProgress />;
        case SolutionStatus.SOLVED:
          return <ImCheckmark color="teal" />;
        case SolutionStatus.ERROR:
          return <MdError color="red" />;
      }
  }
}

export function ProblemNode(props: NodeProps<ProblemNodeData>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSubProblems, setSelectedSubProblems] = useState<string[]>([]);

  const nodeType = getNodeType(props.data);
  const nodeColor = getStatusColor(props.data.problemDtos);

  const { solvers, getSolvers } = useSolvers();

  // Type id is the same for all problems
  const typeId = props.data.problemDtos[0].typeId;
  const solverId = props.data.problemDtos[0].solverId;
  const solverName = solvers[typeId]?.find((s) => s.id === solverId)?.name;

  // Fetch solvers for type if necessary
  getSolvers(typeId);

  const extended = solverId !== undefined;

  console.log("ProblemNode", typeId, props.data.problemDtos);

  return (
    <VStack
      width="10rem"
      css={{
        // prevent this from consuming pointer events
        pointerEvents: "none",
        "& > *": {
          pointerEvents: "auto",
        },
      }}
    >
      {(nodeType === "output" || nodeType === "default") && (
        <Handle type="target" position={Position.Top} />
      )}
      {(nodeType === "input" || nodeType === "default") && (
        <Handle type="source" position={Position.Bottom} />
      )}
      <Box
        border="1px"
        borderRadius={extended ? "0px" : "10px"}
        borderTopRadius="10px"
        background={nodeColor}
        width="10rem"
        fontSize="xs"
        position="relative"
        zIndex="2"
        css={{
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            left: "50%",
            bottom: "-10px",
            width: "15px",
            height: "15px",
            background: "white",
            border: "1px solid black",
            borderRadius: "5px",
            zIndex: 1,
          },
          "&::before": {
            transform: "translate(calc(-50% - 50px))",
          },
          "&::after": {
            transform: "translate(calc(-50% + 50px))",
          },
        }}
      >
        <HStack align="start" maxW="10rem" padding="0.5rem">
          <Tooltip hasArrow label="Problem" placement="bottom">
            <div style={{ height: "20px" }}>
              <BsDatabaseFillGear size="1.5rem" />
            </div>
          </Tooltip>
          <VStack>
            <Text fontWeight="semibold">
              {props.data.problemDtos[0].typeId}
            </Text>
          </VStack>
          <div>
            <FaQuestionCircle size="1rem" onClick={onOpen} />
          </div>

          <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior="inside"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalHeader>
                <Text fontWeight="semibold">{typeId}</Text>
              </ModalHeader>
              <ModalBody>
                {props.data.problemDtos.map((problemDto) => (
                  <>
                    <ProblemDetails
                      key={problemDto.id}
                      problemDto={problemDto}
                    />
                    <Divider />
                  </>
                ))}
              </ModalBody>
            </ModalContent>
          </Modal>
        </HStack>

        {props.data.problemDtos.length > 1 && (
          <VStack bg="white" borderTop="1px" position="relative">
            <Box
              position="absolute"
              bg={nodeColor}
              borderRadius={10}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              top={0}
              left="50%"
              transform="translate(-50%, -50%)"
            >
              {dropdownOpen ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
            </Box>

            <div
              style={{
                width: "100%",
                maxHeight: "10rem",
                overflowY: "auto",
              }}
            >
              {dropdownOpen && (
                <ProblemList
                  problemDtos={props.data.problemDtos}
                  selectedProblems={selectedSubProblems}
                  setSelectedProblems={setSelectedSubProblems}
                />
              )}
            </div>
          </VStack>
        )}
      </Box>

      {extended && (
        <Box
          alignSelf="stretch"
          border="1px"
          borderBottomRadius="10px"
          padding=".5rem"
          background={"kitGreen"}
          fontSize="xs"
          zIndex="0"
          position="relative"
          marginTop="-10px"
        >
          <HStack align="start" maxW="10rem">
            <Tooltip hasArrow label="Solver" placement="bottom">
              <div>
                <FaGears size="2rem" />
              </div>
            </Tooltip>
            <Text padding=".5rem" fontWeight="semibold">
              {solverName}
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
                    <Text fontWeight="semibold">{solverName}</Text>
                  </PopoverHeader>
                  <PopoverBody>
                    <Text>Solves {typeId}</Text>
                    Additional Info:
                    <Button colorScheme="blue">10x Quantum Speedup</Button>
                  </PopoverBody>
                  <PopoverFooter>
                    <Text fontSize="xs">{solverId}</Text>
                  </PopoverFooter>
                </PopoverContent>
              </Portal>
            </Popover>
          </HStack>

          {props.data.problemDtos.some(
            (dto) => dto.state === ProblemState.NEEDS_CONFIGURATION
          ) && (
            <Text
              background="transparent"
              align="center"
              className="hover:#AAAAAAAA"
              border="1px"
              borderRadius="0.25rem"
              paddingX="2rem"
              paddingY="1px"
              onClick={() => {
                for (let problemDto of props.data.problemDtos) {
                  props.data.solveCallback(problemDto);
                }
              }}
            >
              Solve
            </Text>
          )}
        </Box>
      )}
    </VStack>
  );
}
