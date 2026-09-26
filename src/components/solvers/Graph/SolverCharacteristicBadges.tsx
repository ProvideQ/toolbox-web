import { Box, Divider, HStack, Tooltip } from "@chakra-ui/react";
import { ComponentType } from "react";
import {
  LuClipboardCheck,
  LuLock,
  LuLockOpen,
  LuCheck,
  LuStar,
} from "react-icons/lu";
import { SolverRuleProperty } from "../../../api/toolbox/data-model/ProblemSolverInfo";

export const rulePropertyPresentation: Record<
  SolverRuleProperty,
  {
    label: string;
    color: string;
    icon: ComponentType<{ size?: string }>;
    tooltip: string;
  }
> = {
  [SolverRuleProperty.Exact]: {
    label: "Exact",
    color: "yellow.600",
    icon: LuStar,
    tooltip: "Exact: always finds the globally optimal solution.",
  },
  [SolverRuleProperty.Valid]: {
    label: "Valid",
    color: "teal.500",
    icon: LuCheck,
    tooltip:
      "Valid: always returns a solution from the problem's solution space.",
  },
  [SolverRuleProperty.StronglyConstraintPreserving]: {
    label: "Strongly constraint-preserving",
    color: "purple.500",
    icon: LuLock,
    tooltip:
      "Strongly constraint-preserving: the solution space of the output is a subset of the one of the input, so no invalid solutions are added",
  },
  [SolverRuleProperty.WeaklyConstraintPreserving]: {
    label: "Weakly constraint-preserving",
    color: "orange.500",
    icon: LuLockOpen,
    tooltip:
      "Weakly constraint-preserving: constraints are kept or replaced by penalties, so the output solution space contains the input space",
  },
  [SolverRuleProperty.OptimalSolutionPreserving]: {
    label: "Optimal solution-preserving",
    color: "green.600",
    icon: LuClipboardCheck,
    tooltip:
      "Optimal solution-preserving: the optimal solution of the input problem stays the optimal solution of the output.",
  },
};

export interface SolverCharacteristicBadgesProps {
  properties?: SolverRuleProperty[];
}

export const SolverCharacteristicBadges = (
  props: SolverCharacteristicBadgesProps,
) => {
  const properties = props.properties ?? [];
  if (properties.length === 0) {
    return null;
  }
  return (
    <>
      <Divider borderColor="gray.300" marginTop="0.3rem" />
      <HStack spacing="0.4rem" justify="center" width="100%" marginY="0.3rem">
        {properties.map((property) => {
          const presentation = rulePropertyPresentation[property];
          if (!presentation) {
            return null;
          }
          const Icon = presentation.icon;
          return (
            <Tooltip
              key={property}
              hasArrow
              label={presentation.tooltip}
              placement="bottom"
            >
              <Box as="span" color={presentation.color} display="inline-flex">
                <Icon size="0.85rem" />
              </Box>
            </Tooltip>
          );
        })}
      </HStack>
      <Divider borderColor="gray.300" />
    </>
  );
};
