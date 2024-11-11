import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Center,
  Code,
  Heading,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { GMLGraphView } from "../../components/solvers/Graph/GMLGraphView";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const MaxCut: NextPage = () => {
  const [graphString, setGraphString] = useState("");

  return (
    <Layout>
      <Heading as="h1">MaxCut Solver</Heading>
      <Text color="text" align="justify">
        For a given weighted graph, this algorithm finds a partition of the
        graph so that the sum of edge weights <i>between</i> these partitions is
        maximal. The graph can be specified in the{" "}
        <Link
          href="https://en.wikipedia.org/wiki/Graph_Modelling_Language"
          color={"blue.400"}
        >
          Graph Modeling Language
        </Link>{" "}
        and edge weights can be specified with the <Code>weight</Code>{" "}
        properties. If the <Code>weight</Code> property is omitted, a weight of
        <Code>1</Code> units is used implicitly. All solvers will return a graph
        (in the GML format) with the same node <Code>id</Code>s, where each node
        has a <Code>partition</Code> value assigned. Example MaxCut problems can
        be found{" "}
        <Link
          href="https://github.com/ProvideQ/maxcut-problems"
          color={"blue.400"}
        >
          here
        </Link>
        .
      </Text>

      <Spacer />

      <TextInputMask
        problemTypeId="max-cut"
        textPlaceholder="Enter your graph in GML format"
        text={graphString}
        setText={setGraphString}
        body={
          <Accordion width="100%" allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>Preview</AccordionButton>
              </h2>
              <AccordionPanel>
                <Center>
                  <GMLGraphView gml={graphString} />
                </Center>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        }
      />

      <SolverConfiguration problemTypeId="max-cut" problemInput={graphString} />
    </Layout>
  );
};
export default MaxCut;
