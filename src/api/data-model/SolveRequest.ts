import { MetaSolverSetting } from "./MetaSolverSettings";

export interface SolverChoice {
  /**
   * If no solver id is provided, the toolbox choose the solver itself via meta solver strategy
   */
  requestedSolverId?: string;
  /**
   * If no solver id is provided, the toolbox choose the solver itself via meta solver strategy
   */
  requestedMetaSolverSettings?: MetaSolverSetting[];
  /**
   * Map from problem type to SubSolveRequest to allow explicitly requested solvers for a subroutine
   */
  requestedSubSolveRequests: SolveMap;
}

export interface SolveRequest<T> extends SolverChoice {
  requestContent: T;
}

export type SolveMap = {
  [key: string]: SolverChoice;
};
