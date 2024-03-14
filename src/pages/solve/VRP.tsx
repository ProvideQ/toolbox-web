import {
  Box,
  Divider,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { ProgressHandler } from "../../components/solvers/ProgressHandler";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const FeatureModelAnomaly: NextPage = () => {
  const [vrp, setVrp] = useState<string>("");

  return (
    <Layout>
      <Heading as="h1">Vehicle Routing Problem Solvers</Heading>
      <Text color="text" align="justify">
        The vehicle routing problem (VRP) is a combinatorial optimization and
        integer programming problem which asks "What is the optimal set of
        routes for a fleet of vehicles to traverse in order to deliver to a
        given set of customers?". It generalizes the well-known traveling
        salesman problem (TSP).
      </Text>

      <TextInputMask
        text={vrp}
        onTextChanged={setVrp}
        textPlaceholder="Enter your VRP in TSPLIB format"
        body={
          <VStack>
            <ProgressHandler
              problemTypes={["vrp"]}
              problemInput={vrp}
              setProblemInput={setVrp}
            />
          </VStack>
        }
      />
    </Layout>
  );
};
export default FeatureModelAnomaly;
