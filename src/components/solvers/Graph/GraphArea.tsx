import { Box, Center, Container, Select, Spacer } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import G6, { Graph, GraphData } from "@antv/g6";

interface GraphAreaProps {
  graphData: GraphData;

  graphHeight: number;
  graphWidth: number;
}

export const GraphArea = (props: GraphAreaProps) => {
  const graphTypes = [
    "random",
    "force",
    "circular",
    "radial",
    "mds",
    "dagre",
    "concentric",
    "grid",
  ];

  const graphRef = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [graphDirected, setGraphDirected] = useState<boolean>(false);

  useEffect(() => {
    if (!graph && graphRef.current && graphRef.current.children.length == 0) {
      setGraph(
        new G6.Graph({
          container: graphRef.current,
          width: 500,
          height: 500,
          modes: {
            default: ["drag-canvas", "zoom-canvas", "drag-node"],
          },
          defaultEdge: {
            style: {
              startArrow: true,
              endArrow: true,
            },
          },
        })
      );
    }

    if (graph && props.graphData) {
      graph.data(props.graphData);
      graph.render();
      updateGraphDirected(props.graphData.directed == "1" ?? false);
    }

    function updateGraphDirected(directed: boolean) {
      if (!graph || graphDirected == directed) return;
      setGraphDirected(directed);

      if (directed) {
        for (let edge of graph.getEdges()) {
          graph.update(edge, {
            style: {
              startArrow: false,
              endArrow: true,
            },
          });
        }
      } else {
        for (let edge of graph.getEdges()) {
          graph.update(edge, {
            style: {
              startArrow: true,
              endArrow: true,
            },
          });
        }
      }
    }
  }, [graph, graphDirected, props.graphData]);

  return (
    <Container
      border="1px"
      borderColor="#AAAAAA"
      borderRadius="10px"
      padding={5}
    >
      <Select
        placeholder="Select graph layout"
        onChange={(e) => graph?.updateLayout({ type: e.target.value })}
      >
        {graphTypes.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </Select>

      <Spacer h={2} />

      <Center>
        <Box
          ref={graphRef}
          borderWidth="3px"
          borderRadius="lg"
          width={props.graphWidth}
          height={props.graphHeight}
        />
      </Center>
    </Container>
  );
};
