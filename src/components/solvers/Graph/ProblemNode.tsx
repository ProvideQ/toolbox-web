import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BsDatabaseFillGear } from "react-icons/bs";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaQuestion,
  FaQuestionCircle,
} from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { ImCheckmark } from "react-icons/im";
import { MdError } from "react-icons/md";
import { Handle, NodeProps, Position } from "reactflow";
import { ProblemDto } from "../../../api/data-model/ProblemDto";
import { ProblemState } from "../../../api/data-model/ProblemState";
import { SolutionStatus } from "../../../api/data-model/SolutionStatus";
import { SubRoutineReferenceDto } from "../../../api/data-model/SubRoutineReferenceDto";
import { fetchProblem } from "../../../api/ToolboxAPI";
import { SolutionView } from "../SolutionView";
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
  problemDto: ProblemDto<any>;

  // Styling info
  level: number;
  levelInfo: LevelInfo;

  // solve: (problem: ProblemDto<any>) => void;
}

function getNodeType(data: ProblemNodeData) {
  // Add input/output connect points for edges
  if (data.problemDto.state === ProblemState.NEEDS_CONFIGURATION) {
    if (data.level == 0) {
      return "input";
    } else {
      return "default";
    }
  } else {
    if (data.level === 0) {
      return "input";
    } else if (data.problemDto.subProblems.length == 0) {
      return "output";
    } else {
      return "default";
    }
  }
}

function getStatusColor(problemDto: ProblemDto<any>): Color {
  switch (problemDto.state) {
    case ProblemState.NEEDS_CONFIGURATION:
      return "ghostwhite";
    case ProblemState.READY_TO_SOLVE:
      return "cornflowerblue";
    case ProblemState.SOLVING:
      return "cornflowerblue";
    case ProblemState.SOLVED:
      switch (problemDto.solution.status) {
        case SolutionStatus.INVALID:
          return "orange";
        case SolutionStatus.COMPUTING:
          return "cornflowerblue";
        case SolutionStatus.SOLVED:
          return "teal";
        case SolutionStatus.ERROR:
          return "red";
      }
  }
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
  const nodeColor = getStatusColor(props.data.problemDto);

  useEffect(() => {}, [props.data.problemDto.subProblems]);

  const { solvers, getSolvers } = useSolvers();

  const solverName = solvers[props.data.problemDto.typeId]?.find(
    (s) => s.id === props.data.problemDto.solverId
  )?.name;

  console.log(
    "ProblemNode",
    props.data.problemDto.typeId,
    props.data.problemDto.id,
    props.data.problemDto.state,
    props.data.problemDto.subProblems
  );

  return (
    <Box
      border="1px"
      borderRadius="10px"
      background={nodeColor}
      fontSize="xs"
      overflow="hidden"
    >
      {(nodeType === "output" || nodeType === "default") && (
        <Handle type="target" position={Position.Top} />
      )}
      {(nodeType === "input" || nodeType === "default") && (
        <Handle type="source" position={Position.Bottom} />
      )}
      <HStack align="start" maxW="10rem" padding="0.5rem">
        <Tooltip hasArrow label="Problem" placement="bottom">
          <div style={{ height: "20px" }}>
            <BsDatabaseFillGear size="1.5rem" />
          </div>
        </Tooltip>
        <VStack>
          <Text fontWeight="semibold">{props.data.problemDto.typeId}</Text>
          <Text fontWeight="light" fontSize="xs">
            {solverName}
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
              <Text fontWeight="semibold">{props.data.problemDto.typeId}</Text>
            </ModalHeader>
            <ModalBody>
              <ProblemDetails problemDto={props.data.problemDto} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </HStack>

      {props.data.problemDto.subProblems.length > 0 && (
        <VStack maxWidth="10rem" bg="white" borderTop="1px" position="relative">
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
            {/*// todo: subproblem list should be in the child node instead. so subproblemms for SAT should be listed in the SAT node - EACH SAT NODE should also keep the state of the current subproblem meaning you can see the solution of the subproblem too
             SO WE NEED TO PASS THE LIST OF SUBPROBLEMS TO THE CHILD NODE AND HAVE A WAY TO REPRESENT A LIST OF PROBLEM NODES*/}
            {dropdownOpen
              ? props.data.problemDto.subProblems.map((subRoutine) => (
                  <SubProblemList
                    key={subRoutine.subRoutine.typeId}
                    selectedProblems={selectedSubProblems}
                    setSelectedProblems={setSelectedSubProblems}
                    subRoutineDefinition={subRoutine}
                  />
                ))
              : props.data.problemDto.subProblems.map((subProblem) => (
                  <HStack
                    key={subProblem.subRoutine.typeId}
                    align="start"
                    width="100%"
                  >
                    <Text paddingLeft={2} fontSize=".4rem">
                      {subProblem.subProblemIds.length}
                      {"x "}
                      {subProblem.subRoutine.typeId}
                    </Text>
                    <div
                      style={{
                        maxWidth: "10rem",
                        height: "0.6rem",
                        display: "flex",
                        flex: "1 0 auto",
                        flexDirection: "row",
                      }}
                    >
                      {subProblem.subProblemIds.map((subProblemId) => {
                        // todo extract to component and save subproblemdto state
                        // let subProblemDto = await fetchProblem(
                        //   subProblem.subRoutine.typeId,
                        //   subProblemId
                        // );
                        return (
                          <Box
                            key={subProblemId}
                            flexGrow={1}
                            bg="white"
                            minW=".1rem"
                          />
                        );
                      })}
                    </div>
                  </HStack>
                ))}
          </div>
        </VStack>
      )}
    </Box>
  );
}

function getHumanReadableState(status: ProblemState) {
  switch (status) {
    case ProblemState.NEEDS_CONFIGURATION:
      return "Needs Configuration";
    case ProblemState.READY_TO_SOLVE:
      return "Ready to Solve";
    case ProblemState.SOLVING:
      return "Solving";
    case ProblemState.SOLVED:
      return "Solved";
  }
}

export const SubProblemList = (props: {
  subRoutineDefinition: SubRoutineReferenceDto;
  selectedProblems: string[];
  setSelectedProblems: Dispatch<SetStateAction<string[]>>;
}) => {
  const [subProblems, setSubProblems] = useState<ProblemDto<any>[]>([]);
  const [lastSelectedProblem, setLastSelectedProblem] = useState<
    ProblemDto<any> | undefined
  >(undefined);

  const { solvers, getSolvers } = useSolvers();

  // Fetch latest sub problem dtos
  useEffect(() => {
    Promise.all(
      props.subRoutineDefinition.subProblemIds.map((subProblemId) =>
        fetchProblem(props.subRoutineDefinition.subRoutine.typeId, subProblemId)
      )
    ).then((subProblems) => setSubProblems(subProblems));
  }, [props.subRoutineDefinition]);

  function handleClick(
    e: React.MouseEvent<HTMLDivElement>,
    clickedSubProblem: ProblemDto<any>
  ) {
    setLastSelectedProblem(clickedSubProblem);
    if (!lastSelectedProblem) {
      props.setSelectedProblems([clickedSubProblem.id]);
      return;
    }

    let newProblemIds: string[];
    if (e.shiftKey) {
      let lastIndex = subProblems.indexOf(lastSelectedProblem);
      let currentIndex = subProblems.indexOf(clickedSubProblem);
      let start = Math.min(lastIndex, currentIndex);
      let end = Math.max(lastIndex, currentIndex);
      newProblemIds = subProblems.slice(start, end + 1).map((p) => p.id);
    } else {
      newProblemIds = [clickedSubProblem.id];
    }

    if (e.ctrlKey) {
      props.setSelectedProblems((prev) => [
        ...prev.filter((id) => !newProblemIds.includes(id)),
        ...newProblemIds.filter(
          (id) => lastSelectedProblem.id == id || !prev.includes(id)
        ),
      ]);
    } else {
      props.setSelectedProblems((prev) =>
        newProblemIds.filter(
          (id) => lastSelectedProblem.id == id || !prev.includes(id)
        )
      );
    }
  }

  return (
    // <TableContainer key={subProblem.subRoutine.typeId}>
    //   <Table size="2sm">
    //     <Thead>
    //       <Tr>
    //         <Th>Subroutine</Th>
    //         <Th>Solver</Th>
    //         <Th>Status</Th>
    //       </Tr>
    //     </Thead>
    //     <Tbody>
    //       {subProblem.subProblemIds.map((subProblemId, index) => {
    //         return (
    //           <Tr key={index}>
    //             <Td>
    //               {subProblem.subRoutine.typeId} {index}
    //             </Td>
    //             <Td>No solver</Td>
    //             <Td>Not solved</Td>
    //           </Tr>
    //         );
    //       })}
    //     </Tbody>
    //   </Table>
    // </TableContainer>
    <>
      <VStack fontSize="2xs" gap={0}>
        <Text alignSelf="start">
          Selected {props.selectedProblems.length} of {subProblems.length}
        </Text>

        {subProblems.map((subProblem, index) => {
          getSolvers(subProblem.typeId);
          return (
            <Flex
              key={subProblem.id}
              direction="row"
              width="100%"
              alignItems="center"
              bg={
                props.selectedProblems.find((id) => id == subProblem.id)
                  ? "lightgrey"
                  : "white"
              }
              onClick={(e) => handleClick(e, subProblem)}
            >
              <Text width=".75rem">{getStatusIcon(subProblem)}</Text>
              <Text width="3rem">
                {props.subRoutineDefinition.subRoutine.typeId} {index + 1}
              </Text>

              <Text width="4rem">
                {subProblem.solverId
                  ? solvers[subProblem.typeId]?.find(
                      (s) => s.id == subProblem.solverId
                    )?.name ?? subProblem.solverId
                  : "-"}
              </Text>
            </Flex>
            // <Grid key={subProblemId} gridTemplateColumns="150px 1fr">
            //   <GridItem>
            //     <Text>
            //       {props.subRoutineDefinition.subRoutine.typeId} {index}
            //     </Text>
            //   </GridItem>
            //   <GridItem>
            //     <Text>-</Text>
            //   </GridItem>
            //   <GridItem>
            //     <Text>{<FaQuestion />}</Text>
            //   </GridItem>
            // </Grid>
          );
        })}
      </VStack>
    </>
  );
};

export const ProblemDetails = (props: { problemDto: ProblemDto<any> }) => {
  const { solvers, getSolvers } = useSolvers();

  // Update solvers in case they are not loaded yet
  if (!solvers[props.problemDto.typeId]) getSolvers(props.problemDto.typeId);

  return (
    <VStack gap="20px" align="start">
      <Text>Status: {getHumanReadableState(props.problemDto.state)}</Text>
      <Text>
        Solver:{" "}
        {solvers[props.problemDto.typeId]?.find(
          (s) => s.id === props.problemDto.solverId
        )?.name ?? "-"}
      </Text>
      {props.problemDto.subProblems.length === 0 ? (
        <Text>No subroutines</Text>
      ) : (
        <VStack width="100%" align="stretch">
          Sub Routines:
          <Accordion>
            {props.problemDto.subProblems.map((subProblem) => (
              <AccordionItem key={subProblem.subRoutine.typeId}>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      {subProblem.subRoutine.typeId}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb="4">
                  {subProblem.subRoutine.description}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      )}
      {props.problemDto.solution !== null && (
        <SolutionView solution={props.problemDto.solution} />
      )}
    </VStack>
  );
};
