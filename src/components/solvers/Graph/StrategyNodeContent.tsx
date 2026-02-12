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
import { ReactNode, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { PiGraph } from "react-icons/pi";
import { MetaSolverStrategyDto } from "../../../api/strategy/data-model/MetaSolverStrategyDto";

export interface StrategyNodeContentProps {
  strategy: MetaSolverStrategyDto;
  button: {
    label: ReactNode;
    callback?: () => void;
  };
}

export const StrategyNodeContent = (props: StrategyNodeContentProps) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  return (
    <VStack gap="0px">
      <HStack align="start" maxW="10rem" justifyContent="space-between" gap="0">
        <Tooltip hasArrow label="Strategy" placement="bottom">
          <div>
            <PiGraph size="2rem" />
          </div>
        </Tooltip>
        <Text padding=".25rem" fontWeight="semibold">
          {props.strategy.name}
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
                <Text fontWeight="semibold">{props.strategy.name}</Text>
              </PopoverHeader>
              <PopoverBody>
                <Text>{props.strategy.code}</Text>
              </PopoverBody>
              <PopoverFooter>
                <Text fontSize="xs">{props.strategy.id}</Text>
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
          bg="#4664aa"
          width="100%"
          height="25px"
          textColor="white"
          fontWeight="bold"
          fontSize="small"
          isDisabled={isRunning}
          _hover={{
            bg: props.button.callback ? "kitBlueAlpha" : "kitBlue",
          }}
          border="1px"
          borderColor="black"
          borderRadius="0.25rem"
          paddingY="1px"
          onClick={() => {
            setIsRunning(true);
            props.button.callback?.();
          }}
        >
          {isRunning ? "Running..." : props.button.label}
        </Button>
      </div>
    </VStack>
  );
};
