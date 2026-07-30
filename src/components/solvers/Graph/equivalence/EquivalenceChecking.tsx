import { Button, Heading, HStack, Text } from "@chakra-ui/react";
import { useEquivalenceChecking } from "./useEquivalenceChecking";

interface Props {}

export function EquivalenceChecking({}: Props) {
  const equivalenceChecking = useEquivalenceChecking();

  return (
    <>
      <Heading as="h4" size="md">
        Equivalence Checking
      </Heading>
      <Text>Check the input OpenQASM of two nodes for equivalence</Text>
      {!equivalenceChecking.isRunning ? (
        <Button onClick={equivalenceChecking.activate}>
          Check Equivalence
        </Button>
      ) : (
        <HStack gap="8px">
          <Button
            onClick={equivalenceChecking.check}
            disabled={!equivalenceChecking.canCheck()}
          >
            Check
          </Button>
          <Button onClick={equivalenceChecking.cancel}>Cancel</Button>
        </HStack>
      )}
      {equivalenceChecking.output}
    </>
  );
}
