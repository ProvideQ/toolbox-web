import { createContext, ReactNode, useMemo, useState } from "react";
import { Node } from "reactflow";
import { ProblemNodeData } from "../ProblemNode";

interface Props {
  children: ReactNode;
}

type NodeSelectionLimitOptions = {
  limit: number;
  strategy: "prevent" | "evictOldest";
};

type ProblemSelectorContextType = {
  allNodes: Node<ProblemNodeData>[];
  updateAllNodes: (nodes: Node<ProblemNodeData>[]) => void;
  isInSelectionMode: boolean;
  updateIsInSelectionMode: (isInSelectionMode: boolean) => void;
  nodeSelectionLimitOptions: NodeSelectionLimitOptions;
  updateNodeSelectionLimitOptions: (options: NodeSelectionLimitOptions) => void;
  isNodeSelectable: (nodeId: string, nodeData: ProblemNodeData) => boolean;
  updateIsNodeSelectable: (
    selector: (nodeId: string, nodeData: ProblemNodeData) => boolean,
  ) => void;
  selectedNodes: Node<ProblemNodeData>[];
  selectNodeId: (nodeId: string) => void;
  unselectNodeId: (nodeId: string) => void;
  toggleNodeIdSelection: (nodeId: string) => void;
  clearNodeSelection: () => void;
};

export const NodeSelectorContext = createContext<ProblemSelectorContextType>({
  allNodes: [],
  updateAllNodes: () => {},
  isInSelectionMode: false,
  updateIsInSelectionMode: () => {},
  nodeSelectionLimitOptions: { limit: 1, strategy: "evictOldest" },
  updateNodeSelectionLimitOptions: () => {},
  isNodeSelectable: () => false,
  updateIsNodeSelectable: () => {},
  selectedNodes: [],
  selectNodeId: () => {},
  unselectNodeId: () => {},
  toggleNodeIdSelection: () => {},
  clearNodeSelection: () => {},
});

export function NodeSelectorProvider({ children }: Props) {
  const [allNodes, setAllNodes] = useState<Node<ProblemNodeData>[]>([]);

  function updateAllNodes(nodes: Node<ProblemNodeData>[]) {
    setAllNodes(nodes);
  }

  const [isInSelectionMode, setIsInSelectionMode] = useState(false);

  function updateIsInSelectionMode(isInSelectionMode: boolean) {
    setIsInSelectionMode(isInSelectionMode);
    if (!isInSelectionMode) {
      clearNodeSelection();
      setIsNodeSelectable(() => false);
    }
  }

  const [nodeSelectionLimitOptions, setNodeSelectionLimitOptions] =
    useState<NodeSelectionLimitOptions>({
      limit: 1,
      strategy: "evictOldest",
    });

  function updateNodeSelectionLimitOptions(options: NodeSelectionLimitOptions) {
    const sanitizedOptions: NodeSelectionLimitOptions = {
      limit: Math.max(0, options.limit),
      strategy: options.strategy,
    };
    setNodeSelectionLimitOptions(sanitizedOptions);
  }

  const [isNodeSelectable, setIsNodeSelectable] = useState<
    (nodeId: string, nodeData: ProblemNodeData) => boolean
  >((_) => false);

  function updateIsNodeSelectable(
    selector: (nodeId: string, nodeData: ProblemNodeData) => boolean,
  ) {
    setIsNodeSelectable(() => selector);
  }

  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const selectedNodes = useMemo(
    () => allNodes.filter((node) => selectedNodeIds.includes(node.id)),
    [selectedNodeIds, allNodes],
  );

  function getNodeIdsWith(newNodeId: string, prevNodeIds: string[]) {
    const limit = Math.max(0, nodeSelectionLimitOptions.limit);
    const strategy = nodeSelectionLimitOptions.strategy;

    if (limit === 0) {
      return [];
    }

    if (prevNodeIds.includes(newNodeId)) {
      return prevNodeIds;
    }

    if (prevNodeIds.length >= limit && strategy === "prevent") {
      return prevNodeIds;
    }

    const next = [...prevNodeIds, newNodeId];

    if (strategy === "evictOldest") {
      return next.slice(-limit);
    }

    return next;
  }

  function getNodeIdsWithout(oldNodeId: string, prevNodeIds: string[]) {
    return prevNodeIds.filter((nodeId) => nodeId !== oldNodeId);
  }

  function selectNodeId(id: string) {
    setSelectedNodeIds((prev) => getNodeIdsWith(id, prev));
  }

  function unselectNodeId(id: string) {
    setSelectedNodeIds((prev) => getNodeIdsWithout(id, prev));
  }

  function toggleNodeIdSelection(id: string) {
    setSelectedNodeIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((nodeId) => nodeId !== id);
      }

      return getNodeIdsWith(id, prev);
    });
  }

  function clearNodeSelection() {
    setSelectedNodeIds([]);
  }

  return (
    <NodeSelectorContext.Provider
      value={{
        allNodes,
        updateAllNodes,
        isInSelectionMode,
        updateIsInSelectionMode,
        nodeSelectionLimitOptions,
        updateNodeSelectionLimitOptions,
        isNodeSelectable,
        updateIsNodeSelectable,
        selectedNodes,
        selectNodeId,
        unselectNodeId,
        toggleNodeIdSelection,
        clearNodeSelection,
      }}
    >
      {children}
    </NodeSelectorContext.Provider>
  );
}
