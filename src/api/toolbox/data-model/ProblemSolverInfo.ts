export enum SolverCharacteristic {
  Solve = "SOLVE",
  Reformulation = "REFORMULATION",
  Decomposition = "DECOMPOSITION",
}

export interface ProblemSolverInfo {
  id: string;
  name: string;
  description: string;
  characteristics?: SolverCharacteristic[];
}
