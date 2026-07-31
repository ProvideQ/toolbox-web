import { Link, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { MainPage } from "../../components/layout/page-layout/MainPage";
import { NodeDetailsProvider } from "../../components/solvers/Graph/state/NodeDetailsProvider";
import { NodeSelectorProvider } from "../../components/solvers/Graph/state/NodeSelectorProvider";

const Knapsack: NextPage = () => {
  return (
    <NodeDetailsProvider>
      <NodeSelectorProvider>
        <MainPage description={<Description />} />
      </NodeSelectorProvider>
    </NodeDetailsProvider>
  );
};

export default Knapsack;

function Description() {
  return (
    <Text color="text" align="justify">
      In the 0-1 knapsack problem, we are given a list of items, each with a
      weight and a value, and the maximum weight that the knapsack can hold. The
      goal is to find the subset of items that maximizes the total value while
      keeping the total weight below the maximum weight. Example problems and an
      explanation of the input format can be found{" "}
      <Link
        href="https://github.com/ProvideQ/knapsack-problems"
        color="blue.400"
      >
        here
      </Link>
      .
    </Text>
  );
}
