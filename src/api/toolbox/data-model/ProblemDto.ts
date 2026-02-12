import { ProblemState } from "./ProblemState";
import { getInvalidSolutionObject, SolutionObject } from "./SolutionObject";
import { SolverSetting } from "./SolverSettings";
import { SubRoutineReferenceDto } from "./SubRoutineReferenceDto";

export interface ProblemDto<T> {
  id: string;
  typeId: string;
  input: T;
  solution: SolutionObject;
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
