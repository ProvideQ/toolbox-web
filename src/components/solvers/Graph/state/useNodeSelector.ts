import { useContext } from "react";
import { NodeSelectorContext } from "./NodeSelectorProvider";

export function useNodeSelector() {
  const context = useContext(NodeSelectorContext);

  if (!context) {
    throw new Error(
      "useNodeSelector must be used within a NodeSelectorProvider",
    );
  }

  return context;
}
