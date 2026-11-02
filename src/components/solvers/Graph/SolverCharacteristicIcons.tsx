import { Box, HStack, Tooltip } from "@chakra-ui/react";
import { ComponentType } from "react";
import { FaGears } from "react-icons/fa6";
import { LuForward, LuReplace } from "react-icons/lu";
import { PiTreeStructure } from "react-icons/pi";
import { TbTargetArrow } from "react-icons/tb";
import { SolverRuleType } from "../../../api/toolbox/data-model/ProblemSolverInfo";

export const ruleTypePresentation: Record<
  SolverRuleType,
  {
    label: string;
    color: string;
    icon: ComponentType<{ size?: string }>;
    tooltip: string;
  }
> = {
  [SolverRuleType.Solve]: {
    label: "Solve",
    color: "green.500",
    icon: TbTargetArrow,
    tooltip: "Solve: obtains a solution for the problem.",
  },
  [SolverRuleType.Reformulation]: {
    label: "Reformulate",
    color: "blue.500",
    icon: LuReplace,
    tooltip: "Reformulate: maps the problem onto another problem type.",
  },
  [SolverRuleType.Decomposition]: {
    label: "Decompose",
    color: "purple.500",
    icon: PiTreeStructure,
    tooltip: "Decompose: splits the problem into several subproblems.",
  },
  [SolverRuleType.Delegation]: {
    label: "Delegate",
    color: "orange.500",
    icon: LuForward,
    tooltip:
      "Delegate: hands the unchanged problem over to another problem type.",
  },
};

export interface SolverCharacteristicIconsProps {
  types?: SolverRuleType[];
}

export const SolverCharacteristicIcons = (
  props: SolverCharacteristicIconsProps,
) => {
  const types = props.types ?? [];
  if (types.length === 0) {
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
      {types.map((type) => {
        const presentation = ruleTypePresentation[type];
        const Icon = presentation.icon;
        return (
          <Tooltip
            key={type}
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
