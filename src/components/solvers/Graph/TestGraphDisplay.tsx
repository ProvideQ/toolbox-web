import { useEffect, useState } from "react";
import { ProblemGraph } from "../../../api/data-model/ProblemGraph";
import { fetchProblemGraph } from "../../../api/ToolboxAPI";
import { ProblemGraphView } from "./ProblemGraphView";

export const TestGraphDisplay = () => {
  let [graph, setGraph] = useState<ProblemGraph | null>(null);

  useEffect(() => {
    fetchProblemGraph().then((graph) => {
      setGraph(graph);
    });
  }, []);

  return <ProblemGraphView graph={graph} />;
};
