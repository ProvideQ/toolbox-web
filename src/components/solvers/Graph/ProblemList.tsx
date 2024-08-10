import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { BiPlay } from "react-icons/bi";
import { FaQuestion, FaQuestionCircle } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { ImCheckmark } from "react-icons/im";
import { MdError } from "react-icons/md";
import {
  canProblemSolverBeUpdated,
  ProblemDto,
} from "../../../api/data-model/ProblemDto";
import { ProblemState } from "../../../api/data-model/ProblemState";
import { SolutionStatus } from "../../../api/data-model/SolutionStatus";
import { patchProblem } from "../../../api/ToolboxAPI";
import { ProblemDetails } from "./ProblemDetails";
import { useGraphUpdates } from "./ProblemGraphView";
import { useSolvers } from "./SolverProvider";

export const ProblemList = (props: {
  problemDtos: ProblemDto<any>[];
  selectedProblemIds: string[];
  setSelectedProblemIds: Dispatch<SetStateAction<string[]>>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalProblemDto, setModalProblemDto] = useState<ProblemDto<any>>();
  const [lastSelectedProblem, setLastSelectedProblem] = useState<
    ProblemDto<any> | undefined
  >(undefined);

  const { solvers, getSolvers } = useSolvers();
  const { updateProblem } = useGraphUpdates();

  const typeId = props.problemDtos[0].typeId;
  const solverId = props.problemDtos[0].solverId;

  function getStatusIcon(problemDto: ProblemDto<any>): JSX.Element {
    switch (problemDto.state) {
      case ProblemState.NEEDS_CONFIGURATION:
        return <FaQuestion color="red" />;
      case ProblemState.READY_TO_SOLVE:
        return (
          <BiPlay
            color="green"
            onClick={() => {
              patchProblem(problemDto.typeId, problemDto.id, {
                state: ProblemState.SOLVING,
              }).then((dto) => {
                updateProblem(dto.id);
              });
            }}
          />
        );
      case ProblemState.SOLVING:
        return (
          <Spinner speed="1s" width="10px" height="10px" thickness="1px" />
        );
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

  function handleClick(
    e: React.MouseEvent<HTMLDivElement>,
    clickedSubProblem: ProblemDto<any>
  ) {
    setLastSelectedProblem(clickedSubProblem);
    if (!lastSelectedProblem) {
      props.setSelectedProblemIds([clickedSubProblem.id]);
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
      props.setSelectedProblemIds((prev) => [
        ...prev.filter((id) => !newProblemIds.includes(id)),
        ...newProblemIds.filter(
          (id) => lastSelectedProblem.id == id || !prev.includes(id)
        ),
      ]);
    } else {
      props.setSelectedProblemIds((prev) =>
        newProblemIds.filter(
          (id) => lastSelectedProblem.id == id || !prev.includes(id)
        )
      );
    }
  }

  return (
    <VStack fontSize="2xs" gap={0}>
      <Text alignSelf="start">
        Selected {props.selectedProblemIds.length} of {props.problemDtos.length}
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
            {modalProblemDto && <ProblemDetails problemDto={modalProblemDto} />}
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
            props.selectedProblemIds.find((id) => id == problemDto.id)
              ? "lightgrey"
              : "ghostwhite"
          }
          onClick={(e) => handleClick(e, problemDto)}
        >
          <Text width=".75rem">{getStatusIcon(problemDto)}</Text>
          <Text width="3rem">
            {typeId} {index + 1}
          </Text>
          <Select
            disabled={!canProblemSolverBeUpdated(problemDto)}
            variant="unstyled"
            key={problemDto.id}
            padding="0px"
            margin="0px"
            fontSize="2xs"
            defaultValue={problemDto.solverId}
            onChange={(e) => {
              patchProblem(problemDto.typeId, problemDto.id, {
                solverId: e.target.value,
              }).then((dto) => {
                updateProblem(dto.id);
              });
            }}
          >
            {[
              <option key="" value="">
                -
              </option>,
              ...solvers[problemDto.typeId].map((solverInfo) => (
                <option key={solverInfo.id} value={solverInfo.id}>
                  {solverInfo.name}
                </option>
              )),
            ]}
          </Select>

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
  );
};
