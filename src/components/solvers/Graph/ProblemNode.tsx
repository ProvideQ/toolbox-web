import {
  Box,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Property } from "csstype";
import { useEffect, useState } from "react";
import { BsDatabaseFillGear } from "react-icons/bs";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaQuestionCircle,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
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
import { SolverNodeContent } from "./SolverNodeContent";
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

function getState(problemDtos: ProblemDto<any>[]): ProblemState {
  if (problemDtos.some((dto) => canProblemSolverBeUpdated(dto))) {
    return ProblemState.READY_TO_SOLVE;
  } else if (problemDtos.some((dto) => dto.state === ProblemState.SOLVING)) {
    return ProblemState.SOLVING;
  } else if (problemDtos.every((dto) => dto.state === ProblemState.SOLVED)) {
    return ProblemState.SOLVED;
  } else {
    return ProblemState.NEEDS_CONFIGURATION;
  }
}

export function ProblemNode(props: NodeProps<ProblemNodeData>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);
  const [nodeState, setNodeState] = useState<ProblemState>(
    getState(props.data.problemDtos)
  );

  // Update node state when problems change
  useEffect(() => {
    setNodeState(getState(props.data.problemDtos));
  }, [props.data.problemDtos]);

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

  const extended = solverId && solverName;
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

  function problemButton() {
    switch (nodeState) {
      case ProblemState.READY_TO_SOLVE:
      case ProblemState.NEEDS_CONFIGURATION:
        return {
          label: "Solve",
          callback: () => {
            // Set state to solving manually so the ui updates instantly
            setNodeState(ProblemState.SOLVING);

            for (let problemDto of props.data.problemDtos) {
              patchProblem(problemDto.typeId, problemDto.id, {
                state: ProblemState.SOLVING,
              }).then((dto) => {
                updateProblem(dto.id);
              });
            }

            // Update the state again after a delay to attempt
            // to ensure that the backend has updated the state
            setTimeout(() => {
              for (let problemDto of props.data.problemDtos) {
                updateProblem(problemDto.id);
              }
            }, 500);
          },
        };
      case ProblemState.SOLVING:
        return {
          label: (
            <HStack gap="1rem">
              <Text fontWeight="bold" fontSize="small" paddingY="1px">
                Solving
              </Text>
              <Spinner speed="1s" width="10px" height="10px" thickness="1px" />
            </HStack>
          ),
        };
      case ProblemState.SOLVED:
        return { label: "Solved" };
    }
  }

  return (
    <VStack
      cursor="default"
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
          (transform) => (
            <div
              key={transform}
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
                ) && (
                  <FaXmark cursor="pointer" color="red" onClick={disconnect} />
                )}
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
          <Text fontWeight="semibold">
            {multiProblem ? props.data.problemDtos.length + "x " : ""}
            {props.data.problemDtos[0].typeId}
          </Text>
          <div>
            <FaQuestionCircle cursor="pointer" size="1rem" onClick={onOpen} />
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
              cursor="pointer"
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
          <SolverNodeContent
            problemTypeId={typeId}
            solver={{
              id: solverId,
              name: solverName,
            }}
            button={problemButton()}
          />
        </Box>
      )}
    </VStack>
  );
}
