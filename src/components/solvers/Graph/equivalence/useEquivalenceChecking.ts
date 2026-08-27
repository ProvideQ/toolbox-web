import { useRef, useState } from "react";
import { ProblemNodeData } from "../ProblemNode";
import { useNodeSelector } from "../state/useNodeSelector";

export type EquivalenceCheckStatus =
  | "equivalent"
  | "not_equivalent"
  | "unknown"
  | "error";

export type EquivalenceCheckResponse = {
  strategy: "mqt-qcec" | "pyzx";
  status: EquivalenceCheckStatus;
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
  const [result, setResult] = useState<EquivalenceCheckResponse>();
  const [isRunning, setIsRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const nodeSelector = useNodeSelector();
  const previousSelectionLimitOptions = useRef(
    nodeSelector.nodeSelectionLimitOptions,
  );

  const strategy = "mqt-qcec";
  // const strategy = "pyzx";

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
    setResult(undefined);
    setIsRunning(true);

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
    if (!canCheck() || isChecking) {
      return;
    }

    setIsChecking(true);

    try {
      const [firstNode, secondNode] = nodeSelector.selectedNodes;
      const qasmA = firstNode.data.problemDtos[0].input;
      const qasmB = secondNode.data.problemDtos[0].input;

      setResult(await performCheck(qasmA, qasmB));
    } catch (error) {
      setResult(createErrorResult(error));
    } finally {
      setIsChecking(false);
      setIsRunning(false);
      finishSelection();
    }
  }

  function canCheck() {
    return nodeSelector.selectedNodes.length === 2;
  }

  async function performCheck(
    qasmA: string,
    qasmB: string,
  ): Promise<EquivalenceCheckResponse> {
    const response = await fetch("http://localhost:8080/tools/equivalencechecking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ strategy, qasmA, qasmB }),
    });

    return response.json();
  }

  function createErrorResult(error: unknown): EquivalenceCheckResponse {
    const errorType = error instanceof Error ? error.name : "UnknownError";
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";

    return {
      strategy,
      status: "error",
      globalPhaseIgnored: null,
      runtimeMs: 0,
      rawEquivalence: null,
      message: "The equivalence service could not complete the request.",
      error: {
        type: errorType,
        message: errorMessage,
      },
    };
  }

  return {
    activate,
    cancel,
    check,
    canCheck,
    result,
    isRunning,
    isChecking,
    selectedNodeCount: nodeSelector.selectedNodes.length,
  };
}
