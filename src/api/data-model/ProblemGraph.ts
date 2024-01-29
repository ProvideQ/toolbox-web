import { ProblemSolver } from "./ProblemSolver";
import { SolutionStatus } from "./SolutionStatus";

export interface ProblemGraph {
  start: ProblemNode;
}

export interface ProblemNode {
  problemType: string;
  status: SolutionStatus;
  solutionId: number;
  solver?: ProblemSolver;
  subRoutines: ProblemNode[];
}
