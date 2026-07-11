import { useState } from "react";
import { ProblemDto } from "../../../../api/toolbox/data-model/ProblemDto";
import { ProblemNodeData } from "../ProblemNode";
import { useNodeSelector } from "../state/useNodeSelector";

type EquivalenceCheckResponse = {
  strategy: "mqt-qcec";
  status: "equivalent" | "not_equivalent" | "unknown" | "error";
  globalPhaseIgnored: boolean | null;
  runtimeMs: number;
  rawEquivalence: string | null;
  message: string | null;
  error: {
    type: string;
    message: string;
  } | null;
};

export function useEquivalenceChecking(problemDto: ProblemDto<any>) {
  const [output, setOutput] = useState<string>();
  const [isRunning, setIsRunning] = useState(false);
  const nodeSelector = useNodeSelector();

  function cancel() {
    setIsRunning(false);
    console.log("cancel");
    nodeSelector.updateIsInSelectionMode(false);
  }

  function activate() {
    setIsRunning(true);
    setOutput("Select another node")
    function isNodeSelectable(_: string, nodeData: ProblemNodeData) {
      console.log("nodeData:", nodeData);
      if ((nodeData?.problemDtos?.length ?? 0) === 0) {
        console.log("1");
        return false;
      }
      const input = nodeData.problemDtos[0].input;
      if (!input || !(typeof input === "string")) {
        console.log("2");
        return false;
      }
      console.log("3");
      const firstLine = input.split("\n")[0];
      return firstLine
        .toLowerCase()
        .replace(/[-_\s]/g, "")
        .includes("openqasm");
    }

    nodeSelector.updateIsNodeSelectable(isNodeSelectable);
    nodeSelector.updateIsInSelectionMode(true);
  }

  async function check() {
    if (!canCheck()) {
      console.log('cannot check but dont know why');
      return;
    }

    setIsRunning(true);
    setOutput("Running...");

    let output: string;
    try {
      const qasmA = problemDto.input;
      const qasmB = nodeSelector.selectedNodes[0].data.problemDtos[0].input;

      output = await performCheck(qasmA, qasmB);
    } catch {
      output = "Error";
    }

    setOutput(output);
    setIsRunning(false);
  }

  function canCheck() {
    return nodeSelector.selectedNodes.length > 0;
  }

  return {
    activate,
    cancel,
    check,
    canCheck,
    output,
    isRunning,
  };
}

async function performCheck(qasmA: string, qasmB: string) {
  const response = await fetch("http://localhost:8100/api/equivalence-check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ qasmA, qasmB }),
  });
  const data: EquivalenceCheckResponse = await response.json();

  return data.status;
}
