import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Divider,
  HStack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { ComponentType, useEffect, useState } from "react";
import { LuCircleAlert, LuCircleCheck, LuCircleHelp } from "react-icons/lu";
import { CorrectnessVerdict } from "../../../api/toolbox/data-model/CorrectnessVerdict";
import {
  getCorrectnessExplanation,
  getUnknownRuleCount,
  getUnknownStepLabel,
  getViolationMessage,
  ProblemStrategyDto,
  StrategyStepDto,
} from "../../../api/toolbox/data-model/ProblemStrategyDto";
import { getHumanReadableTypeId } from "../../../api/toolbox/data-model/ProblemTypeDto";
import { toolboxApi } from "../../../api/toolbox/ToolboxAPI";
import { rulePropertyPresentation } from "../Graph/SolverCharacteristicBadges";
import { ruleTypePresentation } from "../Graph/SolverCharacteristicIcons";

const refreshIntervalMs = 2000;

const verdictPresentation: Record<
  CorrectnessVerdict,
  {
    label: string;
    color: string;
    icon: ComponentType<{ size?: string }>;
    tooltip: string;
  }
> = {
  [CorrectnessVerdict.CORRECT]: {
    label: "Correct",
    color: "kitGreen",
    icon: LuCircleCheck,
    tooltip:
      "Correct: every rule of this strategy is known and satisfies the properties its rule type requires.",
  },
  [CorrectnessVerdict.INCORRECT]: {
    label: "Incorrect",
    color: "red.500",
    icon: LuCircleAlert,
    tooltip:
      "Incorrect: at least one rule of this strategy does not have the property its rule type requires.",
  },
  [CorrectnessVerdict.UNDETERMINED]: {
    label: "Undetermined",
    color: "gray.500",
    icon: LuCircleHelp,
    tooltip:
      "Undetermined: no violation was found, but the selection is not complete yet, so a rule that breaks correctness could still be added.",
  },
};

const StepEntry = (props: { step: StrategyStepDto; index: number }) => {
  const { step } = props;
  const unknownLabel = getUnknownStepLabel(step);

  return (
    <HStack
      align="start"
      spacing="0.5rem"
      paddingY="0.4rem"
      paddingLeft={`${step.depth * 1.25}rem`}
    >
      <Text fontSize="xs" color="gray.500" minWidth="1.25rem">
        {props.index + 1}.
      </Text>

      <VStack align="start" spacing="0.15rem" flex="1">
        <HStack spacing="0.35rem" wrap="wrap">
          {(step.characteristics?.types ?? []).map((type) => {
            const presentation = ruleTypePresentation[type];
            if (!presentation) return null;
            const Icon = presentation.icon;
            return (
              <Tooltip
                key={type}
                hasArrow
                label={presentation.tooltip}
                placement="bottom"
              >
                <Box as="span" color={presentation.color} display="inline-flex">
                  <Icon size="1rem" />
                </Box>
              </Tooltip>
            );
          })}
          <Text fontWeight="semibold" fontSize="sm">
            {getHumanReadableTypeId(step.problemTypeId)}
          </Text>
          {unknownLabel !== undefined && (
            <Text fontSize="xs" color="gray.500" fontStyle="italic">
              ({unknownLabel})
            </Text>
          )}
        </HStack>

        {unknownLabel === undefined && (
          <>
            <Text fontSize="xs">{step.solverName}</Text>
            <HStack spacing="0.5rem" wrap="wrap">
              {(step.characteristics?.properties ?? []).map((property) => {
                const presentation = rulePropertyPresentation[property];
                if (!presentation) return null;
                const Icon = presentation.icon;
                return (
                  <Tooltip
                    key={property}
                    hasArrow
                    label={presentation.tooltip}
                    placement="bottom"
                  >
                    <HStack
                      spacing="0.2rem"
                      color={presentation.color}
                      fontSize="xs"
                    >
                      <Icon size="0.75rem" />
                      <Text>{presentation.label}</Text>
                    </HStack>
                  </Tooltip>
                );
              })}
            </HStack>
          </>
        )}
      </VStack>
    </HStack>
  );
};

const ViolationEntry = (props: { message: string; problemId: string }) => (
  <Alert status="error" fontSize="sm" borderRadius="0.25rem">
    <AlertIcon />
    <VStack align="start" spacing="0px">
      <Text>{props.message}</Text>
      <Text fontSize="xs" color="gray.600">
        {props.problemId}
      </Text>
    </VStack>
  </Alert>
);

export interface StrategyViewProps {
  problemTypeId: string;
  problemId: string;
  reloadToken?: unknown;
}

export const StrategyView = (props: StrategyViewProps) => {
  const [result, setResult] = useState<
    { problemId: string; strategy?: ProblemStrategyDto } | undefined
  >(undefined);

  useEffect(() => {
    let cancelled = false;
    const problemId = props.problemId;

    function load() {
      toolboxApi
        .fetchProblemStrategy(props.problemTypeId, problemId)
        .then((strategy) => {
          if (cancelled) return;
          setResult({ problemId: problemId, strategy: strategy });
        })
        .catch((error) => {
          if (cancelled) return;
          console.error("Failed to load strategy", error);
        });
    }

    load();
    const timer = setInterval(load, refreshIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [props.problemId, props.problemTypeId, props.reloadToken]);

  const strategy =
    result?.problemId === props.problemId ? result.strategy : undefined;

  if (strategy === undefined) {
    return null;
  }

  const correctness = strategy.correctness;
  const verdict = verdictPresentation[correctness.verdict];
  const VerdictIcon = verdict.icon;
  const unknownRuleCount = getUnknownRuleCount(strategy);

  return (
    <Accordion allowToggle width="100%" borderColor="gray.200">
      <AccordionItem>
        <h2>
          <AccordionButton>
            <HStack flex="1" align="start" textAlign="left" spacing="0.5rem">
              <Box paddingTop="0.15rem">
                <Tooltip hasArrow label={verdict.tooltip} placement="bottom">
                  <Box
                    as="span"
                    aria-label={`Strategy correctness: ${verdict.label}`}
                    color={verdict.color}
                    display="inline-flex"
                  >
                    <VerdictIcon size="1.25rem" />
                  </Box>
                </Tooltip>
              </Box>
              <VStack align="start" spacing="0px">
                <Text fontWeight="semibold" fontSize="sm">
                  Strategy correctness: {verdict.label}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {getCorrectnessExplanation(strategy)}
                </Text>
              </VStack>
            </HStack>
            <AccordionIcon />
          </AccordionButton>
        </h2>

        <AccordionPanel pb="4">
          <VStack align="stretch" spacing="0.75rem">
            {correctness.violations.length > 0 && (
              <VStack align="stretch" spacing="0.35rem">
                {correctness.violations.map((violation, index) => (
                  <ViolationEntry
                    key={`${violation.problemId}-${violation.requiredProperty}-${index}`}
                    message={getViolationMessage(strategy, violation)}
                    problemId={violation.problemId}
                  />
                ))}
              </VStack>
            )}

            {unknownRuleCount > 0 && (
              <Text fontSize="xs" color="gray.500">
                {unknownRuleCount === 1
                  ? "1 rule is still unknown."
                  : `${unknownRuleCount} rules are still unknown.`}{" "}
                Configure the rules marked below to get a definitive verdict.
              </Text>
            )}

            <Text fontWeight="bold" fontSize="sm">
              Rules in application order:
            </Text>
            <VStack align="stretch" spacing="0px" divider={<Divider />}>
              {strategy.steps.map((step, index) => (
                <StepEntry
                  key={`${step.problemId ?? "pending"}-${step.problemTypeId}-${index}`}
                  step={step}
                  index={index}
                />
              ))}
            </VStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
