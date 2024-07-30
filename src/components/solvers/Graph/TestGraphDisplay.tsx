import { ProblemGraphView } from "./ProblemGraphView";
import { SolverProvider } from "./SolverProvider";

export const TestGraphDisplay = () => {
  return (
    <SolverProvider>
      <ProblemGraphView
        problemTypeId="feature-model-anomaly-dead"
        problemId="e706eaa9-7ba1-4b9a-9adf-de9a73dc15be"
      />
    </SolverProvider>
  );
};
