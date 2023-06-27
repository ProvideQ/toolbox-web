import { Button, Tooltip, Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface GoButtonProps {
  clicked: MouseEventHandler<HTMLButtonElement>;
}

export const GoButton = (props: GoButtonProps) => (
  <Flex alignSelf="flex-start">
    <Tooltip label="Unleash the Qubits!" color="white">
      <Button colorScheme="teal" size="lg" onClick={props.clicked}>
        GO!
      </Button>
    </Tooltip>
  </Flex>
);
