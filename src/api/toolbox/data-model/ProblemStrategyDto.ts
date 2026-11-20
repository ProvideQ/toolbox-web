import { CorrectnessVerdict } from "./CorrectnessVerdict";
import {
  SolverCharacteristics,
  SolverRuleProperty,
  SolverRuleType,
} from "./ProblemSolverInfo";

export interface StrategyStepDto {
  problemId: string | null;
  problemTypeId: string;
  depth: number;
  solverName: string | null;
  characteristics: SolverCharacteristics | null;
  configured: boolean;
  guarded: boolean;
  guardedBy: string | null;
}

export interface CorrectnessViolationDto {
  problemId: string;
  ruleType: SolverRuleType;
  requiredProperty: SolverRuleProperty;
  guardedBy: string | null;
}

export interface StrategyCorrectnessDto {
  verdict: CorrectnessVerdict;
  violations: CorrectnessViolationDto[];
}

export interface ProblemStrategyDto {
  steps: StrategyStepDto[];
  correctness: StrategyCorrectnessDto;
}

export function getUnknownStepLabel(step: StrategyStepDto): string | undefined {
  if (step.configured) {
    return undefined;
  }

  return step.problemId === null
    ? "not called yet, so its rules are still unknown"
    : "waiting for a solver to be selected";
}

export function getUnknownRuleCount(strategy: ProblemStrategyDto): number {
  return strategy.steps.filter(
    (step) => !step.configured && step.guardedBy === null,
  ).length;
}

export function getGuardNote(
  strategy: ProblemStrategyDto,
  violation: CorrectnessViolationDto,
): string | undefined {
  if (violation.guardedBy === null) {
    return undefined;
  }

  const guard = strategy.steps.find(
    (candidate) => candidate.problemId === violation.guardedBy,
  );

  return `Covered by the guard of ${guard?.solverName}, rejects invalid results.`;
}

export function getViolationMessage(
  strategy: ProblemStrategyDto,
  violation: CorrectnessViolationDto,
): string {
  const step = strategy.steps.find(
    (candidate) => candidate.problemId === violation.problemId,
  );

  return `${step?.solverName} is used as a ${violation.ruleType} rule for ${step?.problemTypeId} but is not ${violation.requiredProperty}.`;
}

export function getCorrectnessExplanation(
  strategy: ProblemStrategyDto,
): string {
  switch (strategy.correctness.verdict) {
    case CorrectnessVerdict.INCORRECT:
      return "This strategy cannot guarantee a valid solution: at least one of its rules does not have the required property and is not covered by a guard. Choosing a different sub-routine or enabling a guard for the affected rules makes the result reliable.";
    case CorrectnessVerdict.UNDETERMINED:
      return `No rule of this strategy violates correctness so far, but ${getUnknownRuleCount(strategy)} of its rules are not known yet. Configure the remaining sub-routines to decide.`;
    case CorrectnessVerdict.GUARDED_CORRECT:
      return "This strategy is correct due to its guards. Each rule that lacks the required property is covered by an enabled guard, which rejects invalid results. It never returns an invalid solution, but it may return no solution if every attempt is rejected.";
    case CorrectnessVerdict.CORRECT:
      return "This strategy is correct: all of its solve rules are valid and all of its reformulation and decomposition rules are strongly constraint-preserving, so it always produces a valid solution.";
  }
}
