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
import { FaGears, FaXmark } from "react-icons/fa6";
import { GrInProgress } from "react-icons/gr";
import { ImCheckmark } from "react-icons/im";
import { MdError } from "react-icons/md";
import { Handle, NodeProps, Position } from "reactflow";
import {
  canProblemSolverBeUpdated,
  ProblemDto,
} from "../../../api/data-model/ProblemDto";
import { ProblemState } from "../../../api/data-model/ProblemState";
import { SolutionStatus } from "../../../api/data-model/SolutionStatus";
import { patchProblem } from "../../../api/ToolboxAPI";
import { ProblemDetails } from "./ProblemDetails";
import { useGraphUpdates } from "./ProblemGraphView";
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
}

function getNodeType(data: ProblemNodeData): {
  topHandle: boolean;
  bottomHandle: boolean;
} {
  let topHandle = data.level > 0;

  let bottomHandle =
    data.problemDtos[0].solverId === undefined ||
    data.problemDtos.some((dto) => dto.subProblems.length > 0);

  return {
    topHandle: topHandle,
    bottomHandle: bottomHandle,
  };
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
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);

  const { topHandle, bottomHandle } = getNodeType(props.data);
  const nodeColor = getStatusColor(props.data.problemDtos);

  const { solvers, getSolvers } = useSolvers();
  const { updateProblem } = useGraphUpdates();

  // Type id is the same for all problems
  const typeId = props.data.problemDtos[0].typeId;
  const solverId = props.data.problemDtos[0].solverId;
  const solverName = solvers[typeId]?.find((s) => s.id === solverId)?.name;

  // Fetch solvers for type if necessary
  getSolvers(typeId);

  const extended = solverId !== undefined;
  const multiProblem = props.data.problemDtos.length > 1;

  function disconnect() {
    for (let problemDto of props.data.problemDtos) {
      patchProblem(problemDto.typeId, problemDto.id, {
        solverId: "",
      }).then((dto) => {
        updateProblem(dto.id);
      });
    }
  }

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
      {topHandle && <Handle type="target" position={Position.Top} />}
      {bottomHandle && <Handle type="source" position={Position.Bottom} />}

      <Box
        bg="red"
        border="1px"
        borderRadius={extended ? "0px" : "10px"}
        borderTopRadius="10px"
        background={nodeColor}
        width="10rem"
        fontSize="xs"
        position="relative"
        zIndex="2"
      >
        {["translate(calc(-50% + 50px))", "translate(calc(-50% + -50px))"].map(
          (transform, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: "50%",
                bottom: "-7.5px",
                width: "14px",
                height: "14px",
                transform: transform,
                zIndex: 10,
                background: "white",
                border: "1px solid black",
                borderRadius: "5px",
              }}
            >
              {extended &&
                props.data.problemDtos.every((dto) =>
                  canProblemSolverBeUpdated(dto)
                ) && <FaXmark color="red" onClick={disconnect} />}
            </div>
          )
        )}

        <HStack
          align="center"
          justifyContent="space-between"
          maxW="10rem"
          padding="0.5rem"
          marginBottom={multiProblem ? "0px" : "10px"}
        >
          <Tooltip hasArrow label="Problem" placement="bottom">
            <div style={{ height: "20px" }}>
              <BsDatabaseFillGear size="1.5rem" />
            </div>
          </Tooltip>
          <VStack>
            <Text fontWeight="semibold">
              {multiProblem ? props.data.problemDtos.length + "x " : ""}
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
                  <div key={problemDto.id}>
                    <ProblemDetails problemDto={problemDto} />
                    <Divider />
                  </div>
                ))}
              </ModalBody>
            </ModalContent>
          </Modal>
        </HStack>

        {multiProblem && (
          <VStack
            top="10px"
            borderTop={dropdownOpen ? "1px" : "0px"}
            position="relative"
          >
            <Box
              position="absolute"
              bg={nodeColor}
              borderRadius={10}
              onClick={() => setDropdownOpen(!dropdownOpen)}
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
                marginBottom: "10px",
              }}
            >
              {dropdownOpen && (
                <ProblemList
                  problemDtos={props.data.problemDtos}
                  selectedProblemIds={selectedProblemIds}
                  setSelectedProblemIds={setSelectedProblemIds}
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
          background="ghostwhite"
          fontSize="xs"
          zIndex="0"
          position="relative"
          marginTop="-10px"
        >
          <HStack align="start" maxW="10rem" justifyContent="space-between">
            <Tooltip hasArrow label="Solver" placement="bottom">
              <div>
                <FaGears size="2rem" />
              </div>
            </Tooltip>
            <Text fontWeight="semibold">{solverName}</Text>

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

          {/*Solve Button*/}
          {props.data.problemDtos.some(
            (dto) =>
              dto.state === ProblemState.NEEDS_CONFIGURATION ||
              dto.state === ProblemState.READY_TO_SOLVE
          ) &&
            props.data.problemDtos.every(
              (dto) => dto.state !== ProblemState.SOLVING
            ) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "0.5rem",
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
                    bg: "kitGreenAlpha",
                  }}
                  border="1px"
                  borderColor="black"
                  borderRadius="0.25rem"
                  paddingY="1px"
                  onClick={() => {
                    for (let problemDto of props.data.problemDtos) {
                      patchProblem(problemDto.typeId, problemDto.id, {
                        state: ProblemState.SOLVING,
                      }).then((dto) => {
                        updateProblem(dto.id);
                      });
                    }
                  }}
                >
                  Solve
                </Button>
              </div>
            )}

          {/*Solving*/}
          {props.data.problemDtos.some(
            (dto) => dto.state === ProblemState.SOLVING
          ) && (
            <HStack
              border="1px"
              borderColor="black"
              borderRadius="0.25rem"
              background="kitGreenAlpha"
              className="hover:#AAAAAAAA"
              textColor="white"
              align="center"
              justifyContent="center"
            >
              <Text fontWeight="bold" fontSize="small" paddingY="1px">
                Solving
              </Text>
              <Spinner speed="1s" width="10px" height="10px" thickness="1px" />
            </HStack>
          )}

          {/*Solved*/}
          {props.data.problemDtos.every(
            (dto) => dto.state === ProblemState.SOLVED
          ) && (
            <Text
              background="kitGreenAlpha"
              textColor="white"
              fontWeight="bold"
              fontSize="small"
              align="center"
              className="hover:#AAAAAAAA"
              border="1px"
              borderColor="black"
              borderRadius="0.25rem"
              paddingY="1px"
            >
              Solved
            </Text>
          )}
        </Box>
      )}
    </VStack>
  );
}
