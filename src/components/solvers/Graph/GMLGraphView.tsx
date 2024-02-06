import { useEffect } from "react";
import {
  Controls,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { parseGML } from "../../../converter/graph/gml/GmlParser";

export const GMLGraphView = (props: { gml: string }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  useEffect(() => {
    let { nodes, edges } = gmlToReactFlow(props.gml);
    setEdges(edges);
    setNodes(nodes);

    function gmlToReactFlow(gml: string): { nodes: Node[]; edges: Edge[] } {
      if (gml == null || gml == "") return { nodes: [], edges: [] };

      let graph: any;
      try {
        graph = parseGML(gml);
      } catch (e) {
        return { nodes: [], edges: [] };
      }

      function getNodeType(node: any): string {
        let input = false;
        let output = false;
        for (let edge of graph.edges) {
          if (edge.source == node.id) {
            input = true;
          }
          if (edge.target == node.id) {
            output = true;
          }
        }

        if (input && output) {
          return "default";
        } else if (input) {
          return "input";
        } else if (output) {
          return "output";
        } else {
          return "default";
        }
      }

      let nodes: Node[] = graph.nodes.map((node: any, i: number) => {
        let n: Node = {
          id: node.id,
          data: { label: node.label },
          type: getNodeType(node),
          position: {
            x: 0,
            y: i * 100,
          },
        };
        return n;
      });

      let edges: Edge[] = graph.edges.map((edge: any, i: number) => {
        let e: Edge = {
          id: i.toString(),
          source: edge.source,
          target: edge.target,
          label: edge.label,
        };
        return e;
      });

      return { nodes, edges };
    }
  }, [props.gml, setEdges, setNodes]);

  return (
    <div
      style={{
        width: "50vw",
        height: "50vh",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
};
