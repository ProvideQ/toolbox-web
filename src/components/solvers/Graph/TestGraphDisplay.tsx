import { ProblemGraphView } from "./ProblemGraphView";
import { SolverProvider } from "./SolverProvider";

export const TestGraphDisplay = () => {
  return (
    <SolverProvider>
      <ProblemGraphView
        problemType="feature-model-anomaly-dead"
        problemId="63c30711-39ef-4eb9-8afe-9fbc59857983"
        problemTypeId="feature-model-anomaly-dead"
      />
    </SolverProvider>
  );
};
