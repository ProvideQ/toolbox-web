import { Button, Text } from "@chakra-ui/react";
import { BoundComparisonDto } from "../../api/data-model/BoundComparisonDto";

export interface VariableDependentDisplayProps {
  buttonTitle: string;
  variable: any | null | undefined;
  getter: () => any;
}

export const VariableDependentDisplay = (
  props: VariableDependentDisplayProps
) => {
  return (
    <>
      {props.variable ? (
        JSON.stringify(props.variable)
      ) : (
        <Button colorScheme="teal" size="md" onClick={() => props.getter()}>
          {props.buttonTitle}
        </Button>
      )}
    </>
  );
};

export interface BoundDisplayProps {
  buttonTitle: string;
  variable: BoundComparisonDto;
  getter: () => any;
}

function toTitleCase(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export const BoundDisplay = (props: BoundDisplayProps) => {
  return (
    <>
      {props.variable?.bound ? (
        <Text>
          {" "}
          {toTitleCase(props.variable.bound.boundType)} bound:{" "}
          {props.variable.bound.value}
        </Text>
      ) : (
        <Button colorScheme="teal" size="md" onClick={() => props.getter()}>
          {props.buttonTitle}
        </Button>
      )}
    </>
  );
};
