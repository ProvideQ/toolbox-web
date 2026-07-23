import { Box, HStack, Tooltip } from "@chakra-ui/react";
import { ComponentType } from "react";
import { FaGears } from "react-icons/fa6";
import { LuReplace } from "react-icons/lu";
import { PiTreeStructure } from "react-icons/pi";
import { TbTargetArrow } from "react-icons/tb";
import { SolverCharacteristic } from "../../../api/toolbox/data-model/ProblemSolverInfo";

export const characteristicPresentation: Record<
  SolverCharacteristic,
  {
    label: string;
    color: string;
    icon: ComponentType<{ size?: string }>;
    tooltip: string;
  }
> = {
  [SolverCharacteristic.Solve]: {
    label: "Solve",
    color: "green.500",
    icon: TbTargetArrow,
    tooltip: "Solve: obtains a solution for the problem.",
  },
  [SolverCharacteristic.Reformulation]: {
    label: "Reformulate",
    color: "blue.500",
    icon: LuReplace,
    tooltip: "Reformulate: maps the problem onto another problem type.",
  },
  [SolverCharacteristic.Decomposition]: {
    label: "Decompose",
    color: "purple.500",
    icon: PiTreeStructure,
    tooltip: "Decompose: splits the problem into several subproblems.",
  },
};

export interface SolverCharacteristicIconsProps {
  characteristics?: SolverCharacteristic[];
}

export const SolverCharacteristicIcons = (
  props: SolverCharacteristicIconsProps,
) => {
  const characteristics = props.characteristics ?? [];
  if (characteristics.length === 0) {
    // fallback to previous icon
    return (
      <Tooltip hasArrow label="Solver" placement="bottom">
        <Box display="inline-flex" marginTop="0.35rem">
          <FaGears size="1.5rem" />
        </Box>
      </Tooltip>
    );
  }

  return (
    <HStack spacing="0.2rem" marginTop="0.4rem">
      {characteristics.map((characteristic) => {
        const presentation = characteristicPresentation[characteristic];
        const Icon = presentation.icon;
        return (
          <Tooltip
            key={characteristic}
            hasArrow
            label={presentation.tooltip}
            placement="bottom"
          >
            <Box as="span" color={presentation.color} display="inline-flex">
              <Icon size="1.5rem" />
            </Box>
          </Tooltip>
        );
      })}
    </HStack>
  );
};
