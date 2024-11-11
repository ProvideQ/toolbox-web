import { Flex, VStack } from "@chakra-ui/react";
import type { XYPosition } from "@reactflow/core/dist/esm/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { ProblemSolverInfo } from "../../../api/data-model/ProblemSolverInfo";
import { ProblemState } from "../../../api/data-model/ProblemState";
import { SubRoutineDefinitionDto } from "../../../api/data-model/SubRoutineDefinitionDto";
import { SubRoutineReferenceDto } from "../../../api/data-model/SubRoutineReferenceDto";
import { fetchProblem, patchProblem } from "../../../api/ToolboxAPI";
import { SolutionView } from "../SolutionView";
import { LevelInfo, ProblemNode, ProblemNodeData } from "./ProblemNode";
import { SolverNode } from "./SolverNode";
import { useSolvers } from "./SolverProvider";

interface ProblemEdgeData {
  sourceProblemDto: ProblemDto<any>;
}

export interface ProblemGraphViewProps {
  problemTypeId: string;
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

function getParentNodeId(nodeId: string): string {
  return nodeId.substring(0, nodeId.lastIndexOf("|"));
}

function getChildNodes(
  nodes: Node[],
  parentNode: Node,
  typeId?: string
): Node[] {
  return nodes.filter((n) => {
    if (n.type !== "problemNode") return false;
    if (!n.id.startsWith(parentNode.id)) return false;

    const subString = n.id.substring(parentNode.id.length + 1);
    return (
      subString.indexOf("|") === -1 &&
      (typeId == undefined || subString.startsWith(typeId))
    );
  });
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

export interface GraphUpdateProps {
  updateProblem: (problemId: string) => void;
}

const GraphUpdateContext = createContext<GraphUpdateProps>({
  updateProblem: (_) => {},
});

export const useGraphUpdates = () => useContext(GraphUpdateContext);

export const ProblemGraphView = (props: ProblemGraphViewProps) => {
  const [nodeIds, setNodeIds] = useState<string[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ProblemEdgeData>([]);
  const [graphInstance, setGraphInstance] = useState<
    ReactFlowInstance | undefined
  >(undefined);
  const solutionViewRef = useRef<HTMLDivElement>(null);

  const { getSolvers } = useSolvers();

  /**
   * Node updates are scheduled in order to provide an asynchronous update mechanism.
   */
  const [scheduledNodeUpdates, setScheduledNodeUpdates] = useState<Node[]>([]);

  const scheduleNodeUpdate = useCallback((updateNode: Node) => {
    setScheduledNodeUpdates((nodes) =>
      nodes.filter((n) => n.id != updateNode.id).concat(updateNode)
    );
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

  const updateEdge = useCallback(
    (edge: Edge<ProblemEdgeData>) => {
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
    },
    [setEdges]
  );

  const createSolverNodes = useCallback(
    (node: Node<ProblemNodeData>) => {
      getSolvers(node.data.problemDtos[0].typeId).then((solvers) => {
        for (let i = 0; i < solvers.length; i++) {
          let solverId =
            node.id + solverNodeIdentifier + solvers[i].id.toString();

          addNode({
            id: solverId,
            data: {
              problemTypeId: node.data.problemDtos[0].typeId,
              problemSolver: solvers[i],
              selectCallback: (problemSolver: ProblemSolverInfo) => {
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
          });

          addEdge({
            id: node.id + solverEdgeIdentifier + solverId,
            type: "step",
            source: node.id,
            target: solverId,
          });
        }
      });
    },
    [
      addEdge,
      addNode,
      edges,
      getSolvers,
      scheduleNodeUpdate,
      setNodes,
      updateEdge,
    ]
  );

  const removeSolverNodes = useCallback(
    (node: Node<ProblemNodeData>) => {
      setNodes((previousNodes) =>
        previousNodes.filter(
          (n) => !n.id.startsWith(node.id + solverNodeIdentifier)
        )
      );
      setEdges((edges) =>
        edges.filter((e) => !e.id.startsWith(node.id + solverEdgeIdentifier))
      );
    },
    [setEdges, setNodes]
  );

  const updateSolverNodes = useCallback(
    (node: Node<ProblemNodeData>) => {
      // Load solver nodes when user action is required
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
    },
    [createSolverNodes, nodes, removeSolverNodes]
  );

  const updateNodeData = useCallback(
    (
      nodeId: string,
      updateNode: (node: Node<ProblemNodeData>) => Node<ProblemNodeData>
    ) => {
      setNodes((previousNodes) =>
        previousNodes.map((node) => {
          if (node.id !== nodeId) return node;

          return updateNode(node);
        })
      );
    },
    [setNodes]
  );

  const updateProblem = useCallback(
    (problemId: string) => {
      const node = nodes.find((n) => {
        if (n.data.problemDtos === undefined) {
          return false;
        }

        return n.data.problemDtos.find(
          (p: ProblemDto<any>) => p.id === problemId
        );
      });

      if (!node) return;

      // Get parent node
      const parentNodeId = getParentNodeId(node.id);
      const parentNode = nodes.find((n) => n.id === parentNodeId);

      if (parentNode) {
        scheduleNodeUpdate(parentNode);
      } else {
        fetchProblem(node.data.problemDtos[0].typeId, problemId).then((dto) => {
          node.data.problemDtos = [dto];
          scheduleNodeUpdate(node);
        });
      }
    },
    [nodes, scheduleNodeUpdate]
  );

  const updateNode = useCallback(
    (node: Node<ProblemNodeData>) => {
      updateSolverNodes(node);

      // Update node data
      updateNodeData(node.id, (n) => ({
        ...n,
        data: node.data,
      }));
      console.log(node.id, node.position.x, node.position.y);

      // Solver id and thus sub problems are the same for all problems, so we can just use the first one
      let subProblemsPerType: Map<
        SubRoutineDefinitionDto,
        SubRoutineReferenceDto[]
      > = new Map<SubRoutineDefinitionDto, SubRoutineReferenceDto[]>();

      // Collect specific sub problems of all subproblems by sub routine
      node.data.problemDtos[0].subProblems.forEach((subRoutineReference, i) => {
        for (let problemDto of node.data.problemDtos) {
          const references = subProblemsPerType.get(
            subRoutineReference.subRoutine
          );
          if (references) {
            subProblemsPerType.set(
              subRoutineReference.subRoutine,
              references.concat(problemDto.subProblems)
            );
          } else {
            subProblemsPerType.set(subRoutineReference.subRoutine, [
              problemDto.subProblems[i],
            ]);
          }
        }
      });

      // Update sub-problem nodes
      for (let subProblems of Array.from(subProblemsPerType.values())) {
        // This can use the first sub problem as the relevant parts
        // (the definition and type of the sub-problem) will be the same for all
        const subRoutineReference = subProblems[0].subRoutine;

        // Fetch all sub problems to update the sub-problem nodes
        Promise.all(
          subProblems
            .flatMap((x) => x.subProblemIds)
            .map((subProblemId) =>
              fetchProblem(subRoutineReference.typeId, subProblemId)
            )
        ).then((subProblemDtos) => {
          // Create sub problem nodes per used solver
          const problemsPerSolver = groupBySolver(subProblemDtos);

          // Keep a list of all existing child nodes to remove the ones that are not needed anymore
          let unusedChildNodes = getChildNodes(
            nodes,
            node,
            subRoutineReference.typeId
          );

          let entries = Array.from(problemsPerSolver.entries());
          for (let j = 0; j < entries.length; j++) {
            let [solverId, problemDtos] = entries[j];

            // Schedule update for unsolved base node if all subproblems were solved
            if (
              node.data.problemDtos.some(
                (dto) => dto.state === ProblemState.SOLVING
              ) &&
              problemDtos.every((dto) => dto.state === ProblemState.SOLVED)
            ) {
              // Schedule update for parent node
              setTimeout(() => {
                for (let problemDto of node.data.problemDtos) {
                  updateProblem(problemDto.id);
                }
              }, 500);
            }

            const problemNodeIdentifier: ProblemNodeIdentifier = {
              subRoutineDefinitionDto: subRoutineReference,
              solverId: solverId,
            };

            const subNodeId = getNodeId(problemNodeIdentifier, node);
            const edgeId = getEdgeId(problemNodeIdentifier, node);

            // Remove child node from unused list
            unusedChildNodes = unusedChildNodes.filter(
              (n) => n.id !== subNodeId
            );

            const subNode = nodes.find((n) => n.id === subNodeId);

            const nodeData: ProblemNodeData = {
              problemDtos: problemDtos,
              level: node.data.level + 1,
              levelInfo: {
                index: j,
                count: entries.length,
              },
            };

            if (subNode) {
              // Update existing node with new data if it exists
              scheduleNodeUpdate({
                ...subNode,
                data: nodeData,
              });

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

              let subNode = createProblemNode(subNodeId, nodeData);
              scheduleNodeUpdate(subNode);
            }
          }

          // Remove all remaining child nodes that are not referenced anymore
          for (let childNode of unusedChildNodes) {
            removeSolverNodes(childNode);
            setNodes((previousNodes) =>
              previousNodes.filter((n) => n.id !== childNode.id)
            );
            setEdges((edges) =>
              edges.filter((e) => !e.id.startsWith(childNode.id))
            );
          }
        });
      }
    },
    [
      addEdge,
      createProblemNode,
      edges,
      nodes,
      removeSolverNodes,
      scheduleNodeUpdate,
      setEdges,
      setNodes,
      updateEdge,
      updateNodeData,
      updateProblem,
      updateSolverNodes,
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
    fetchProblem(props.problemTypeId, props.problemId).then((problemDto) => {
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
      });
      scheduleNodeUpdate(rootNode);
    });
  }, [
    createProblemNode,
    props.problemId,
    props.problemTypeId,
    scheduleNodeUpdate,
    setEdges,
    setNodes,
  ]);

  // Update node ids when nodes change
  useEffect(() => {
    let ids = nodes.sort((a, b) => a.id.localeCompare(b.id)).map((n) => n.id);
    if (ids.join(",") !== nodeIds.join(",")) {
      setNodeIds(ids);
    }
  }, [graphInstance, nodeIds, nodes]);

  // Fit view when nodes change
  useEffect(() => {
    graphInstance?.fitView({
      duration: 500,
      nodes: nodeIds.map((id) => ({
        id: id,
      })),
    });
  }, [graphInstance, nodeIds]);

  useEffect(() => {
    if (solutionViewRef.current) {
      solutionViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [solutionViewRef.current]);

  return (
    <GraphUpdateContext.Provider value={{ updateProblem }}>
      <VStack>
        <div
          style={{
            width: "50vw",
            height: "50vh",
          }}
        >
          <ReactFlow
            zoomOnScroll={false}
            onWheel={(e) => {
              window.scrollBy({
                behavior: "smooth",
                top: e.deltaY,
                left: e.deltaX,
              });
            }}
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
        {nodes.length > 0 &&
          nodes[0].data.problemDtos?.length > 0 &&
          nodes[0].data.problemDtos[0].state === ProblemState.SOLVED && (
            <Flex width="full" ref={solutionViewRef}>
              <SolutionView solution={nodes[0].data.problemDtos[0].solution} />
            </Flex>
          )}
      </VStack>
    </GraphUpdateContext.Provider>
  );
};
