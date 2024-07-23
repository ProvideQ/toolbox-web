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
import { LevelInfo, ProblemNode, ProblemNodeData } from "./ProblemNode";
import { SolverNode, SolverNodeData } from "./SolverNode";
import { useSolvers } from "./SolverProvider";

interface ProblemEdgeData {
  sourceProblemDto: ProblemDto<any>;
}

export interface ProblemGraphViewProps {
  problemType: string;
  problemId: string;
}

export interface ProblemNodeIdentifier {
  subRoutineDefinitionDto: SubRoutineDefinitionDto;
  solverId?: string;
}

/**
 * Nodes are identified recursively through their parent node and the sub-routine definition.
 * Each node can represent either one problem or a collection of problems,
 * but they share the same sub-routine definition and recursive context.
 * @param identifier Identifier for the problem node
 * @param parentNode
 */
function getNodeId(
  identifier: ProblemNodeIdentifier,
  parentNode: Node
): string {
  return (
    parentNode.id +
    "|" +
    identifier.subRoutineDefinitionDto.typeId +
    "-" +
    identifier.subRoutineDefinitionDto.description +
    "-" +
    identifier.solverId
  );
}

/**
 * Edge identifiers are determined by the source and target node identifiers.
 * @param to The target sub-routine definition
 * @param fromId The source node
 */
function getEdgeId(to: ProblemNodeIdentifier, fromId: Node): string {
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
  return level * 200;
}

function groupBySolver(problemDtos: ProblemDto<any>[]) {
  let solvers = new Map<string | undefined, ProblemDto<any>[]>();
  for (let problemDto of problemDtos) {
    const problems = solvers.get(problemDto.solverId);
    if (problems) {
      problems.push(problemDto);
    } else {
      solvers.set(problemDto.solverId, [problemDto]);
    }
  }
  return solvers;
}

const nodeTypes: NodeTypes = {
  solverNode: SolverNode,
  problemNode: ProblemNode,
};
const solverNodeIdentifier: string = "-solver-node-";
const solverEdgeIdentifier: string = "-solver-edge-";

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

  const createProblemNode = useCallback(
    (nodeId: string, nodeData: ProblemNodeData) => {
      let node: Node<ProblemNodeData> = {
        id: nodeId,
        data: nodeData,
        position: getNodePosition(nodeData),
        type: "problemNode",
      };

      addNode(node);

      return node;
    },
    [addNode]
  );

  const updateNode = useCallback(
    (node: Node<ProblemNodeData>) => {
      updateSolverNodes(node);

      // Update node data
      updateNodeData(node.id, (n) => ({
        ...n,
        position: getNodePosition(n.data),
        type: "problemNode",
      }));

      // Solver id and thus sub problems are the same for all problems
      const subProblems = node.data.problemDtos[0].subProblems;

      // Update sub-routine nodes
      for (let i = 0; i < subProblems.length; i++) {
        const subProblem = subProblems[i];

        Promise.all(
          subProblem.subProblemIds.map((subProblemId) =>
            fetchProblem(subProblem.subRoutine.typeId, subProblemId)
          )
        ).then((subProblemDtos) => {
          // Create sub problem nodes per used solver
          const problemsPerSolver = groupBySolver(subProblemDtos);
          problemsPerSolver.forEach((problemDtos, solverId) => {
            const problemNodeIdentifier: ProblemNodeIdentifier = {
              subRoutineDefinitionDto: subProblem.subRoutine,
              solverId: solverId,
            };

            const subNodeId = getNodeId(problemNodeIdentifier, node);
            const edgeId = getEdgeId(problemNodeIdentifier, node);

            const subNode = nodes.find((n) => n.id === subNodeId);
            if (subNode) {
              // Update existing node if it exists
              scheduleNodeUpdate(subNode);

              const edge = edges.find((edge) => edge.id === edgeId);
              if (edge) {
                updateEdge(edge);
              }
            } else {
              // Otherwise create a new node
              addEdge({
                id: edgeId,
                source: node.id,
                target: subNodeId,
                data: {
                  sourceProblemDto: problemDtos,
                },
                animated: problemDtos.some(
                  (dto) => dto.state === ProblemState.SOLVING
                ),
              });

              let subNode = createProblemNode(subNodeId, {
                problemDtos: problemDtos,
                level: node.data.level + 1,
                levelInfo: {
                  index: i,
                  count: subProblems.length,
                },

                solveCallback: (problemDto) => {
                  patchProblem(problemDto.typeId, problemDto.id, {
                    state: ProblemState.SOLVING,
                  }).then((dto) => {
                    setNodes((previousNodes) =>
                      previousNodes.map((n) => {
                        if (n.id !== subNodeId) return n;

                        let updatedNode: Node<ProblemNodeData> = {
                          ...n,
                          data: {
                            ...n.data,
                            problemDtos: [dto], // todo this needs to include all updated dtos
                          },
                        };
                        scheduleNodeUpdate(updatedNode);

                        return updatedNode;
                      })
                    );
                  });
                },
              });
              scheduleNodeUpdate(subNode);
            }
          });
        });
      }

      function createSolverNodes(node: Node<ProblemNodeData>) {
        getSolvers(node.data.problemDtos[0].typeId).then((solvers) => {
          for (let i = 0; i < solvers.length; i++) {
            let solverId = solvers[i].id.toString();
            let solverNodeId = node.id + solverNodeIdentifier + solverId;
            let solverNode: Node<SolverNodeData> = {
              id: solverNodeId,
              data: {
                problemTypeId: node.data.problemDtos[0].typeId,
                problemSolver: solvers[i],
                selectCallback: (problemSolver) => {
                  // todo update visuals here too

                  let edge = edges.find((e) =>
                    e.target.startsWith(node.id + solverEdgeIdentifier)
                  );
                  if (edge) {
                    updateEdge(edge);
                  }

                  Promise.all(
                    node.data.problemDtos.map((problemDto) =>
                      patchProblem(problemDto.typeId, problemDto.id, {
                        solverId: problemSolver.id,
                      })
                    )
                  ).then((dtos) => {
                    setNodes((previousNodes) =>
                      previousNodes.map((n) => {
                        if (n.id !== node.id) return n;

                        let updatedNode: Node<ProblemNodeData> = {
                          ...n,
                          data: {
                            ...n.data,
                            problemDtos: dtos,
                          },
                        };
                        scheduleNodeUpdate(updatedNode);

                        return updatedNode;
                      })
                    );
                  });
                },
              },
              position: {
                x:
                  node.position.x +
                  getNodePositionX({ index: i, count: solvers.length }),
                y: getNodePositionY(node.data.level + 1),
              },
              type: "solverNode",
            };

            addNode(solverNode);

            addEdge({
              id: node.id + solverEdgeIdentifier + solverNode.id,
              type: "step",
              source: node.id,
              target: solverNode.id,
            });
          }
        });
      }

      function updateSolverNodes(node: Node<ProblemNodeData>) {
        // Load solver nodes when user action is required
        console.log("data", node.data);
        if (node.data.problemDtos[0].solverId === undefined) {
          const existingSolverNode = nodes.find((n) =>
            n.id.startsWith(node.id + solverNodeIdentifier)
          );
          if (existingSolverNode === undefined) {
            createSolverNodes(node);
          }
        } else {
          removeSolverNodes(node);
        }
      }

      function removeSolverNodes(node: Node<ProblemNodeData>) {
        setNodes((previousNodes) =>
          previousNodes.filter((n) => {
            let x = n.id.startsWith(node.id + solverNodeIdentifier);
            return !x;
          })
        );
        setEdges((edges) =>
          edges.filter((e) => !e.id.startsWith(node.id + solverEdgeIdentifier))
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
      createProblemNode,
      edges,
      getSolvers,
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
      let rootNode = createProblemNode(props.problemId, {
        problemDtos: [problemDto],
        level: 0,
        levelInfo: {
          index: 0,
          count: 1,
        },
        solveCallback: (problemDto) => {
          patchProblem(problemDto.typeId, problemDto.id, {
            state: ProblemState.SOLVING,
          }).then((dto) => {
            setNodes((previousNodes) =>
              previousNodes.map((n) => {
                if (n.id !== rootNode.id) return n;

                let updatedNode: Node<ProblemNodeData> = {
                  ...n,
                  data: {
                    ...n.data,
                    problemDtos: [dto],
                  },
                };
                scheduleNodeUpdate(updatedNode);

                return updatedNode;
              })
            );
          });
        },
      });
      scheduleNodeUpdate(rootNode);
    });
  }, [
    createProblemNode,
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
