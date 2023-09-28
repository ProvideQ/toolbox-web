import { SolutionStatus } from "./SolutionStatus";

export interface Solution {
  id: number;
  status: SolutionStatus;
  solverName: string;
  executionMilliseconds: number;
  solutionData: any;
  metaData: string;
  debugData: string;
  error: string;
}
