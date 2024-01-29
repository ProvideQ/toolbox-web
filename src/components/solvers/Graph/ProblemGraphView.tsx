import { useEffect } from "react";
import { Controls, Edge, Node, ReactFlow, useEdgesState, useNodesState } from "reactflow";
import { ProblemGraph, ProblemNode } from "../../../api/data-model/ProblemGraph";
import { SolutionStatus } from "../../../api/data-model/SolutionStatus";
import { fetchSolvers } from "../../../api/ToolboxAPI";
import 'reactflow/dist/style.css';

export const ProblemGraphView = (props: { graph: ProblemGraph | null }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  useEffect(() => {
    if (!props.graph) return;

    let { nodes, edges } = problemGraphToReactFlow(props.graph);
    setEdges(edges);
    setNodes(nodes);

    function problemGraphToReactFlow(graph: ProblemGraph): { nodes: Node[]; edges: Edge[] } {
      function getNodeId(node: ProblemNode) {
        return node.problemType + node.solutionId.toString();
      }

      function getEdgeId(from: ProblemNode, to: ProblemNode) {
        return getNodeId(from) + "-" + getNodeId(to);
      }

      function getPositionX(levelInfo: LevelInfo | null) {
        return levelInfo == null
          ? 0
          : levelInfo.index * 200 - levelInfo.count * 50;
      }

      function getPositionY(level: number) {
        return level * 150;
      }

      interface LevelInfo {
        index: number;
        count: number;
      }

      let nodes: Node[] = [];
      let edges: Edge[] = [];

      function addNode(
        problemNode: ProblemNode,
        level: number,
        levelInfo: LevelInfo | null
      ) {
        let id = getNodeId(problemNode);
        let label =
          problemNode.problemType +
          (problemNode.solver == null ? "" : " - " + problemNode.solver?.name);
        let position = {
          x: getPositionX(levelInfo),
          y: getPositionY(level)
        };
        let data = { label: label };
        let type: string;
        if (level == 0) {
          type = "input";
        } else if (problemNode.subRoutines.length == 0) {
          type = "output";
        } else {
          type = "default";
        }

        let node: Node = {
          id: id,
          data: data,
          position: position,
          type: type
        };

        if (problemNode.status == SolutionStatus.PENDING_USER_ACTION) {
          node.style = {
            background: "teal"
          };

          fetchSolvers(problemNode.problemType).then((solvers) => {
            node.type = "default";
            for (let i = 0; i < solvers.length; i++) {
              // Add new node manually
              let solverId = solvers[i].id.toString();
              nodes.push({
                id: solverId,
                data: { label: solvers[i].name },
                position: {
                  x:
                    node.position.x +
                    getPositionX({ index: i, count: solvers.length }),
                  y: getPositionY(level + 1)
                },
                type: "output",
                style: {
                  background: "teal"
                }
              });

              edges.push({
                id: id + "-" + solverId,
                type: "step",
                source: id,
                target: solverId
              });
            }
            node.style = {
              background: "grey"
            };

            setNodes(nodes);
            setEdges(edges);
          });
        }

        nodes.push(node);

        for (let i = 0; i < problemNode.subRoutines.length; i++) {
          const subRoutine = problemNode.subRoutines[i];
          edges.push({
            id: getEdgeId(problemNode, subRoutine),
            source: id,
            target: getNodeId(subRoutine),
            animated: subRoutine.status == SolutionStatus.COMPUTING
          });
          addNode(subRoutine, level + 1, {
            index: i,
            count: problemNode.subRoutines.length
          });
        }
      }

      addNode(graph.start, 0, null);

      return { nodes, edges };
    }
  }, [props.graph, setEdges, setNodes]);

  return (
    <div
      style={{
        width: "50vw",
        height: "50vh",
        border: "2px solid black",
        borderRadius: "15px"
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView>
        <Controls />
      </ReactFlow>
    </div>
  );
};