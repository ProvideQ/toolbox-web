import {
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
import { ReactNode } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { ProblemSolverInfo } from "../../../api/data-model/ProblemSolverInfo";

export interface SolverNodeContentProps {
  problemTypeId: string;
  solver: ProblemSolverInfo;
  button: {
    label: ReactNode;
    callback?: () => void;
  };
}

export const SolverNodeContent = (props: SolverNodeContentProps) => {
  return (
    <VStack gap="0px">
      <HStack align="start" maxW="10rem" justifyContent="space-between">
        <Tooltip hasArrow label="Solver" placement="bottom">
          <div>
            <FaGears size="2rem" />
          </div>
        </Tooltip>
        <Text padding=".5rem" fontWeight="semibold">
          {props.solver.name}
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
                <Text fontWeight="semibold">{props.solver.name}</Text>
              </PopoverHeader>
              <PopoverBody>
                <Text>Solves {props.problemTypeId}</Text>
              </PopoverBody>
              <PopoverFooter>
                <Text fontSize="xs">{props.solver.id}</Text>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </HStack>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "0.5rem",
          width: "100%",
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
            bg: props.button.callback ? "kitGreenAlpha" : "kitGreen",
          }}
          border="1px"
          borderColor="black"
          borderRadius="0.25rem"
          paddingY="1px"
          onClick={props.button.callback}
        >
          {props.button.label}
        </Button>
      </div>
    </VStack>
  );
};
