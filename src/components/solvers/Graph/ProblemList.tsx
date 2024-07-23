import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { FaQuestion, FaQuestionCircle } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { ImCheckmark } from "react-icons/im";
import { MdError } from "react-icons/md";
import { ProblemDto } from "../../../api/data-model/ProblemDto";
import { ProblemState } from "../../../api/data-model/ProblemState";
import { SolutionStatus } from "../../../api/data-model/SolutionStatus";
import { ProblemDetails } from "./ProblemDetails";
import { useSolvers } from "./SolverProvider";

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

export const ProblemList = (props: {
  problemDtos: ProblemDto<any>[];
  selectedProblems: string[];
  setSelectedProblems: Dispatch<SetStateAction<string[]>>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalProblemDto, setModalProblemDto] = useState<ProblemDto<any>>();
  const [lastSelectedProblem, setLastSelectedProblem] = useState<
    ProblemDto<any> | undefined
  >(undefined);

  const { solvers, getSolvers } = useSolvers();

  const typeId = props.problemDtos[0].typeId;
  const solverId = props.problemDtos[0].solverId;

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
      let lastIndex = props.problemDtos.indexOf(lastSelectedProblem);
      let currentIndex = props.problemDtos.indexOf(clickedSubProblem);
      let start = Math.min(lastIndex, currentIndex);
      let end = Math.max(lastIndex, currentIndex);
      newProblemIds = props.problemDtos.slice(start, end + 1).map((p) => p.id);
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
          Selected {props.selectedProblems.length} of {props.problemDtos.length}
        </Text>

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
              {modalProblemDto && (
                <ProblemDetails problemDto={modalProblemDto} />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {props.problemDtos.map((problemDto, index) => (
          <Flex
            key={problemDto.id}
            direction="row"
            width="100%"
            alignItems="center"
            bg={
              props.selectedProblems.find((id) => id == problemDto.id)
                ? "lightgrey"
                : "white"
            }
            onClick={(e) => handleClick(e, problemDto)}
          >
            <Text width=".75rem">{getStatusIcon(problemDto)}</Text>
            <Text width="3rem">
              {typeId} {index + 1}
            </Text>
            <Text width="4rem">
              {problemDto.solverId
                ? solvers[problemDto.typeId]?.find(
                    (s) => s.id == problemDto.solverId
                  )?.name ?? problemDto.solverId
                : "-"}
            </Text>

            <div
              onClick={() => {
                setModalProblemDto(problemDto);
                onOpen();
              }}
            >
              <FaQuestionCircle size="1rem" />
            </div>
          </Flex>
        ))}
      </VStack>
    </>
  );
};
