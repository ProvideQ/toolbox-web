import { useRef, useState } from "react";
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

export function useEquivalenceChecking() {
  const [output, setOutput] = useState<string>();
  const [isRunning, setIsRunning] = useState(false);
  const nodeSelector = useNodeSelector();
  const previousSelectionLimitOptions = useRef(
    nodeSelector.nodeSelectionLimitOptions,
  );

  function finishSelection() {
    nodeSelector.updateIsInSelectionMode(false);
    nodeSelector.updateNodeSelectionLimitOptions(
      previousSelectionLimitOptions.current,
    );
  }

  function cancel() {
    setIsRunning(false);
    finishSelection();
  }

  function activate() {
    previousSelectionLimitOptions.current =
      nodeSelector.nodeSelectionLimitOptions;
    nodeSelector.updateNodeSelectionLimitOptions({
      limit: 2,
      strategy: "evictOldest",
    });
    setIsRunning(true);
    setOutput("Select two nodes");

    function isNodeSelectable(_: string, nodeData: ProblemNodeData) {
      if ((nodeData?.problemDtos?.length ?? 0) === 0) {
        return false;
      }

      const input = nodeData.problemDtos[0].input;
      if (!input || !(typeof input === "string")) {
        return false;
      }

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
      return;
    }

    setIsRunning(true);
    setOutput("Running...");

    let output: string;
    try {
      const [firstNode, secondNode] = nodeSelector.selectedNodes;
      const qasmA = firstNode.data.problemDtos[0].input;
      const qasmB = secondNode.data.problemDtos[0].input;

      output = await performCheck(qasmA, qasmB);
    } catch {
      output = "Error";
    }

    setOutput(output);
    setIsRunning(false);
    finishSelection();
  }

  function canCheck() {
    return nodeSelector.selectedNodes.length === 2;
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
