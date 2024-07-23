import { ProblemState } from "./ProblemState";
import { getInvalidSolutionObject, SolutionObject } from "./SolutionObject";
import { SubRoutineReferenceDto } from "./SubRoutineReferenceDto";

export interface ProblemDto<T> {
  id: string;
  typeId: string;
  input: T;
  solution: SolutionObject;
  state: ProblemState;
  solverId?: string;
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
    state: ProblemState.READY_TO_SOLVE,
    subProblems: [],
    typeId: "",
  };
}
