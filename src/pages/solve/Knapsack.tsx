import { Heading, Link, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const Knapsack: NextPage = () => {
  const [knapsackProblem, setKnapsackProblem] = useState("");

  return (
    <Layout>
      <Heading as="h1">Knapsack Solver</Heading>

      <Text color="text" align="justify">
        In the 0-1 knapsack problem, we are given a list of items, each with a
        weight and a value, and the maximum weight that the knapsack can hold.
        The goal is to find the subset of items that maximizes the total value
        while keeping the total weight below the maximum weight. Example
        problems and an explanation of the input format can be found{" "}
        <Link
          href="https://github.com/ProvideQ/knapsack-problems"
          color={"blue.400"}
        >
          here
        </Link>
        .
      </Text>

      <TextInputMask
        problemTypeId="Knapsack"
        text={knapsackProblem}
        setText={setKnapsackProblem}
        textPlaceholder="Enter your knapsack problem"
      />

      <SolverConfiguration
        problemTypeId="Knapsack"
        problemInput={knapsackProblem}
      />
    </Layout>
  );
};

export default Knapsack;
