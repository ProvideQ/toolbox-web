import { ProblemDto } from "../../toolbox/data-model/ProblemDto";

export interface MetaSolverStrategyExecutionOutput {
  result: ProblemDto<any> | undefined;
}
