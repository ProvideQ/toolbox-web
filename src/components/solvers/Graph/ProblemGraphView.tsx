import type { XYPosition } from "@reactflow/core/dist/esm/types";
import { useCallback, useEffect, useState } from "react";
import {
  Controls,
  Edge,
  Node,
  NodeTypes,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { ProblemDto } from "../../../api/data-model/ProblemDto";
import { ProblemState } from "../../../api/data-model/ProblemState";
import { SubRoutineDefinitionDto } from "../../../api/data-model/SubRoutineDefinitionDto";
import { fetchProblem, patchProblem } from "../../../api/ToolboxAPI";
import { DecisionNode, DecisionNodeData } from "./DecisionNode";
import { LevelInfo, ProblemNode, ProblemNodeData } from "./ProblemNode";
import { useSolvers } from "./SolverProvider";

interface ProblemEdgeData {
  sourceProblemDto: ProblemDto<any>;
}

export interface ProblemGraphViewProps {
  problemType: string;
  problemId: string;
}

/**
 * Nodes are identified recursively through their parent node and the sub-routine definition.
 * Each node can represent either one problem or a collection of problems,
 * but they share the same sub-routine definition and recursive context.
 * @param subRoutineDefinitionDto
 * @param parentNode
 */
function getNodeId(
  subRoutineDefinitionDto: SubRoutineDefinitionDto,
  parentNode: Node
): string {
  return (
    parentNode.id +
    "|" +
    subRoutineDefinitionDto.typeId +
    "-" +
    subRoutineDefinitionDto.description
  );
}

/**
 * Edge identifiers are determined by the source and target node identifiers.
 * @param to The target sub-routine definition
 * @param fromId The source node
 */
function getEdgeId(to: SubRoutineDefinitionDto, fromId: Node): string {
  return fromId + "->" + getNodeId(to, fromId);
}

function getNodePosition(data: ProblemNodeData): XYPosition {
  return {
    x: getNodePositionX(data.levelInfo),
    y: getNodePositionY(data.level),
  };
}

function getNodePositionX(levelInfo: LevelInfo | null): number {
  return levelInfo == null ? 0 : levelInfo.index * 200 - levelInfo.count * 50;
}

function getNodePositionY(level: number): number {
  return level * 150;
}

const nodeTypes: NodeTypes = {
  decisionNode: DecisionNode,
  problemNode: ProblemNode,
};
const decisionNodeIdentifier: string = "-decision-node-";
const decisionEdgeIdentifier: string = "-decision-edge-";

export const ProblemGraphView = (props: ProblemGraphViewProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ProblemEdgeData>([]);
  const [graphInstance, setGraphInstance] = useState<
    ReactFlowInstance | undefined
  >(undefined);

  const { solvers, getSolvers } = useSolvers();

  /**
   * Node updates are scheduled in order to provide an asynchronous update mechanism.
   */
  const [scheduledNodeUpdates, setScheduledNodeUpdates] = useState<Node[]>([]);

  const scheduleNodeUpdate = useCallback((updateNode: Node) => {
    setScheduledNodeUpdates((nodes) => nodes.concat(updateNode));
  }, []);

  const addNode = useCallback(
    (newNode: Node) => {
      setNodes((previousNodes) => {
        let existingNode = previousNodes.find((node) => node.id === newNode.id);
        if (existingNode) {
          return previousNodes;
        }

        return previousNodes.concat(newNode);
      });
    },
    [setNodes]
  );

  const addEdge = useCallback(
    (newEdge: Edge) => {
      setEdges((edges) => {
        let existingEdge = edges.find((edge) => edge.id === newEdge.id);
        if (existingEdge) {
          return edges;
        }

        return edges.concat(newEdge);
      });
    },
    [setEdges]
  );

  const createNode = useCallback(
    (
      nodeId: string,
      problemDto: ProblemDto<any>,
      level: number,
      levelInfo: LevelInfo
    ) => {
      let data: ProblemNodeData = {
        problemDto: problemDto,
        level: level,
        levelInfo: levelInfo,
      };

      let node: Node<ProblemNodeData> = {
        id: nodeId,
        data: data,
        position: getNodePosition(data),
        type: "problemNode",
      };

      addNode(node);

      return node;
    },
    [addNode, scheduleNodeUpdate]
  );

  const updateNode = useCallback(
    (node: Node<ProblemNodeData>) => {
      updateDecisionNodes(node);

      // Update node data
      updateNodeData(node.id, (n) => ({
        ...n,
        position: getNodePosition(n.data),
        type: "problemNode",
      }));

      // Update sub-routine nodes
      for (let i = 0; i < node.data.problemDto.subProblems.length; i++) {
        let subProblem = node.data.problemDto.subProblems[i];
        let subNodeId = getNodeId(subProblem.subRoutine, node);

        let subNode = nodes.find((node) => node.id === subNodeId);
        let edgeId = getEdgeId(subProblem.subRoutine, node);
        if (subNode === undefined) {
          // Create new node
          fetchProblem(
            subProblem.subRoutine.typeId,
            subProblem.subProblemIds[0]
          ).then((subProblemDto) => {
            let subNodeId = getNodeId(subProblem.subRoutine, node);

            addEdge({
              id: edgeId,
              source: node.id,
              target: subNodeId,
              data: {
                sourceProblemDto: node.data.problemDto,
              },
              animated: subProblemDto.state === ProblemState.SOLVING,
            });

            let subNode = createNode(
              subNodeId,
              subProblemDto,
              node.data.level + 1,
              {
                index: i,
                count: node.data.problemDto.subProblems.length,
              }
            );
            scheduleNodeUpdate(subNode);
          });
        } else {
          // Update existing node
          scheduleNodeUpdate(subNode);

          const edge = edges.find((edge) => edge.id === edgeId);
          if (edge) {
            updateEdge(edge);
          }
        }
      }

      function createDecisionNodes(node: Node<ProblemNodeData>) {
        getSolvers(node.data.problemDto.typeId).then((solvers) => {
          for (let i = 0; i < solvers.length; i++) {
            let solverId = solvers[i].id.toString();
            let solverNodeId = node.id + decisionNodeIdentifier + solverId;
            let decisionNode: Node<DecisionNodeData> = {
              id: solverNodeId,
              data: {
                problemSolver: solvers[i],
                problemDto: node.data.problemDto,
                selectCallback: (problemSolver) => {
                  // todo update visuals here too

                  let edge = edges.find((e) =>
                    e.target.startsWith(node.id + decisionEdgeIdentifier)
                  );
                  if (edge) {
                    updateEdge(edge);
                  }

                  patchProblem(
                    node.data.problemDto.typeId,
                    node.data.problemDto.id,
                    {
                      solverId: problemSolver.id,
                      state: ProblemState.SOLVING,
                    }
                  ).then((dto) =>
                    setNodes((previousNodes) =>
                      previousNodes.map((n) => {
                        if (n.id !== node.id) return n;

                        let updatedNode: Node<ProblemNodeData> = {
                          ...n,
                          data: {
                            ...n.data,
                            problemDto: dto,
                          },
                        };
                        scheduleNodeUpdate(updatedNode);

                        return updatedNode;
                      })
                    )
                  );
                },
              },
              position: {
                x:
                  node.position.x +
                  getNodePositionX({ index: i, count: solvers.length }),
                y: getNodePositionY(node.data.level + 1),
              },
              type: "decisionNode",
            };

            addNode(decisionNode);

            addEdge({
              id: node.id + decisionEdgeIdentifier + decisionNode.id,
              type: "step",
              source: node.id,
              target: decisionNode.id,
            });
          }
        });
      }

      function updateDecisionNodes(node: Node) {
        // Load decision nodes when user action is required
        if (node.data.problemDto.state == ProblemState.NEEDS_CONFIGURATION) {
          const existingDecisionNode = nodes.find((n) =>
            n.id.startsWith(node.id + decisionNodeIdentifier)
          );
          if (existingDecisionNode === undefined) {
            createDecisionNodes(node);
          }
        } else {
          removeDecisionNodes(node);
        }
      }

      function removeDecisionNodes(node: Node<ProblemNodeData>) {
        setNodes((previousNodes) =>
          previousNodes.filter((n) => {
            let x = n.id.startsWith(node.id + decisionNodeIdentifier);
            return !x;
          })
        );
        setEdges((edges) =>
          edges.filter(
            (e) => !e.id.startsWith(node.id + decisionEdgeIdentifier)
          )
        );
      }

      function updateNodeData(
        nodeId: string,
        update: (node: Node<ProblemNodeData>) => Node<ProblemNodeData>
      ) {
        setNodes((previousNodes) =>
          previousNodes.map((node) => {
            if (node.id !== nodeId) return node;

            return update(node);
          })
        );
      }

      function updateEdge(edge: Edge<ProblemEdgeData>) {
        setEdges((edges) =>
          edges.map((e) => {
            if (e.id !== edge.id) return e;

            return {
              ...e,
              animated:
                edge.data?.sourceProblemDto.state === ProblemState.SOLVING,
            };
          })
        );
      }
    },
    [
      addEdge,
      addNode,
      createNode,
      edges,
      nodes,
      scheduleNodeUpdate,
      setEdges,
      setNodes,
    ]
  );

  useEffect(() => {
    if (scheduledNodeUpdates.length === 0) return;

    for (let scheduledNodeUpdate of scheduledNodeUpdates) {
      updateNode(scheduledNodeUpdate);
    }
    setScheduledNodeUpdates((nodes) =>
      nodes.filter((node) => !scheduledNodeUpdates.includes(node))
    );
  }, [scheduledNodeUpdates, updateNode]);

  // Repopulate graph when problem changes
  useEffect(() => {
    setNodes([]);
    setEdges([]);
    fetchProblem(props.problemType, props.problemId).then((problemDto) => {
      if (problemDto.error) {
        console.error(problemDto.error);
        return;
      }

      // Create root node
      let rootNode = createNode(props.problemId, problemDto, 0, {
        index: 0,
        count: 1,
      });
      scheduleNodeUpdate(rootNode);
    });
  }, [
    createNode,
    props.problemId,
    props.problemType,
    scheduleNodeUpdate,
    setEdges,
    setNodes,
  ]);

  // Update graph every second
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     let rootNode = nodes.find((node) => node.id == props.problemId);
  //     if (rootNode === undefined) {
  //       return;
  //     }
  //     console.log("update node after one second");
  //
  //     updateNode(rootNode);
  //   }, 1000);
  //
  //   return () => clearInterval(interval);
  // }, [nodes, props.problemId, updateNode]);

  // Fit view when nodes change
  useEffect(() => {
    graphInstance?.fitView({
      duration: 500,
      nodes: nodes,
    });
  }, [graphInstance, nodes]);

  return (
    <div
      style={{
        width: "50vw",
        height: "50vh",
      }}
    >
      <ReactFlow
        onInit={(reactFlowInstance) => setGraphInstance(reactFlowInstance)}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
};
