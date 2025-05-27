import {
  BoundComparisonDto,
  getInvalidBoundComparisonDto,
} from "./BoundComparisonDto";
import { ProblemState } from "./ProblemState";
import { getInvalidSolutionObject, SolutionObject } from "./SolutionObject";
import { SolverSetting } from "./SolverSettings";
import { SubRoutineReferenceDto } from "./SubRoutineReferenceDto";

export interface ProblemDto<T> {
  id: string;
  typeId: string;
  input: T;
  solution: SolutionObject;
  bound: BoundComparisonDto;
  state: ProblemState;
  solverId?: string;
  solverSettings: SolverSetting[];
  subProblems: SubRoutineReferenceDto[];
  error: string;
}

export function getInvalidProblemDto<T>(): ProblemDto<T> {
  return {
    error: "",
    id: "",
    input: {} as T,
    solution: getInvalidSolutionObject(),
    bound: getInvalidBoundComparisonDto(),
    solverId: "",
    solverSettings: [],
    state: ProblemState.READY_TO_SOLVE,
    subProblems: [],
    typeId: "",
  };
}

export function canProblemSolverBeUpdated(problem: ProblemDto<any>): boolean {
  return (
    problem.state === ProblemState.NEEDS_CONFIGURATION ||
    problem.state === ProblemState.READY_TO_SOLVE
  );
}
