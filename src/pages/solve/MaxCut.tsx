import {
  Center,
  Code,
  Divider,
  Heading,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { Container } from "../../components/Container";
import { Layout } from "../../components/layout/Layout";
import { GraphArea } from "../../components/solvers/Graph/GraphArea";
import { ProgressHandler } from "../../components/solvers/ProgressHandler";
import { TextInputMask } from "../../components/solvers/TextInputMask";
import { parseGML } from "../../converter/graph/gml/GmlParser";

const MaxCut: NextPage = () => {
  const [graphData, setGraphData] = useState<any>(null);
  const [graphString, setGraphString] = useState("");

  function change(x: string): void {
    setGraphString(x);
    let data = parseGML(x);
    setGraphData(data);
  }

  return (
    <Layout>
      <Heading as="h1">MaxCut Solver</Heading>
      <Text color="text" align="justify">
        For a given weighted graph, this algorithm finds a partition of the
        graph so that the sum of edge weights <i>between</i> these partitions is
        maximal. The graph can be specified in the{" "}
        <Link href="https://en.wikipedia.org/wiki/Graph_Modelling_Language">
          Graph Modeling Language
        </Link>{" "}
        and edge weights can be specified with the <Code>weight</Code>{" "}
        properties. If the <Code>weight</Code> property is omitted, a weight of
        <Code>1</Code> units is used implicitly. All solvers will return a graph
        (in the GML format) with the same node <Code>id</Code>s, where each node
        has a <Code>partition</Code> value assigned.
      </Text>

      <Spacer />

      <TextInputMask
        textPlaceholder="Enter your graph in GML format"
        onTextChanged={change}
        body={
          <Container>
            <Center>
              <GraphArea
                graphData={graphData}
                graphHeight={500}
                graphWidth={500}
              />
            </Center>

            <Divider />
            <ProgressHandler
              problemTypes={["max-cut"]}
              problemInput={graphString}
            />
          </Container>
        }
      />
    </Layout>
  );
};
export default MaxCut;
