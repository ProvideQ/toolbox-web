import { ProblemGraphView } from "./ProblemGraphView";
import { SolverProvider } from "./SolverProvider";

export const TestGraphDisplay = () => {
  return (
    <SolverProvider>
      <ProblemGraphView
        problemType="feature-model-anomaly-dead"
        problemId="c0e7d01d-9219-4545-80e1-e2b5be11ff5a"
      />
    </SolverProvider>
  );
};
