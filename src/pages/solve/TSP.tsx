import { Heading, Spacer, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const TSP: NextPage = () => {
  const [tsp, setTsp] = useState("");

  return (
    <Layout>
      <Heading as="h1">Traveling Salesperson Problem</Heading>
      <Text color="text" align="justify">
        The Traveling Salesperson Problem (TSP) is a classic combinatorial
        optimization problem. Given a list of cities and the distances between
        them, the task is to find the shortest possible route that visits each
        city exactly once and returns to the origin city.
      </Text>

      <Spacer />

      <TextInputMask
        problemTypeId="tsp"
        text={tsp}
        setText={setTsp}
        textPlaceholder={
          "Enter your Traveling Salesperson Problem in tsp-lib format"
        }
      />

      <SolverConfiguration problemTypeId="tsp" problemInput={tsp} />
    </Layout>
  );
};

export default TSP;
