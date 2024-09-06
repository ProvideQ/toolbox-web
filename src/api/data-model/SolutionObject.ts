import { SolutionStatus } from "./SolutionStatus";

export interface SolutionObject {
  /**
   * UUID of the solution.
   */
  id: string;
  status: SolutionStatus;
  metaData: string;
  solutionData: any;
  debugData: string;
  solverName: string;
  executionMilliseconds: number;
}

export function getInvalidSolutionObject(): SolutionObject {
  return {
    id: "",
    status: SolutionStatus.INVALID,
    metaData: "",
    solutionData: undefined,
    debugData: "",
    solverName: "",
    executionMilliseconds: -1,
  };
}
