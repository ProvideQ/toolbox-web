import { useContext } from "react";
import { NodeDetailsContext } from "./NodeDetailsProvider";

export function useNodeDetails() {
  const context = useContext(NodeDetailsContext);

  if (!context) {
    throw new Error("useNodeDetails must be used within a NodeDetailsProvider");
  }

  return context;
}
