import { Divider, Link, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { PageLayout } from "../../components/layout/page-layout/PageLayout";
import { ProblemConfiguration } from "../../components/solvers/Graph/configuration/ProblemConfiguration";
import { EquivalenceChecking } from "../../components/solvers/Graph/equivalence/EquivalenceChecking";
import { ProblemDetails } from "../../components/solvers/Graph/ProblemDetails";
import { NodeDetailsProvider } from "../../components/solvers/Graph/state/NodeDetailsProvider";
import { NodeSelectorProvider } from "../../components/solvers/Graph/state/NodeSelectorProvider";
import { useNodeDetails } from "../../components/solvers/Graph/state/useNodeDetails";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";

const Knapsack: NextPage = () => {
  return (
    <NodeDetailsProvider>
      <NodeSelectorProvider>
        <KnapsackContent />
      </NodeSelectorProvider>
    </NodeDetailsProvider>
  );
};

export default Knapsack;

const Description = () => {
  return (
    <Text color="text" align="justify">
      In the 0-1 knapsack problem, we are given a list of items, each with a
      weight and a value, and the maximum weight that the knapsack can hold. The
      goal is to find the subset of items that maximizes the total value while
      keeping the total weight below the maximum weight. Example problems and an
      explanation of the input format can be found{" "}
      <Link
        href="https://github.com/ProvideQ/knapsack-problems"
        color={"blue.400"}
      >
        here
      </Link>
      .
    </Text>
  );
};

function KnapsackContent() {
  const [knapsackProblem, setKnapsackProblem] = useState("");
  const nodeDetails = useNodeDetails();
  console.log("nodeDetails.problemDtos", nodeDetails.problemDtos);

  return (
    <PageLayout
      leftTopSidebarContent={
        <ProblemConfiguration
          description={<Description />}
          knapsackProblem={knapsackProblem}
          setKnapsackProblem={setKnapsackProblem}
        />
      }
      rightTopSidebarContent={nodeDetails.problemDtos.map((problemDto) => (
        <div key={problemDto.id}>
          <ProblemDetails problemDto={problemDto} />
          <Divider />
        </div>
      ))}
      rightBottomSidebarContent={<EquivalenceChecking />}
    >
      <SolverConfiguration
        problemTypeId="Knapsack"
        problemInput={knapsackProblem}
      />
    </PageLayout>
  );
}
