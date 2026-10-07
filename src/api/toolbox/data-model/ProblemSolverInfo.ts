export enum SolverRuleType {
  Solve = "SOLVE",
  Reformulation = "REFORMULATION",
  Decomposition = "DECOMPOSITION",
  Delegation = "DELEGATION",
}

export enum SolverRuleProperty {
  Exact = "EXACT",
  Valid = "VALID",
  StronglyConstraintPreserving = "STRONGLY_CONSTRAINT_PRESERVING",
  WeaklyConstraintPreserving = "WEAKLY_CONSTRAINT_PRESERVING",
  OptimalSolutionPreserving = "OPTIMAL_SOLUTION_PRESERVING",
}

export interface SolverCharacteristics {
  types: SolverRuleType[];
  properties: SolverRuleProperty[];
}

export interface ProblemSolverInfo {
  id: string;
  name: string;
  description: string;
  characteristics?: SolverCharacteristics;
}
