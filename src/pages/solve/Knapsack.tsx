import { Heading, Text } from "@chakra-ui/react";
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
        The Knapsack problem is a combinatorial optimization problem that seeks
        to maximize the total value of items in a knapsack without exceeding the
        capacity of the knapsack. You can enter a problem in the following
        format, all integers: a line containing the amount of items, lines
        containing the items in format &quot;id value weight&quot; and a line
        containing the capacity of the knapsack.
      </Text>

      <TextInputMask
        problemTypeId="knapsack"
        text={knapsackProblem}
        setText={setKnapsackProblem}
        textPlaceholder="Enter your knapsack problem"
      />

      <SolverConfiguration
        problemTypeId="knapsack"
        problemInput={knapsackProblem}
      />
    </Layout>
  );
};

export default Knapsack;
