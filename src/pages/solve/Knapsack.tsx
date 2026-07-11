import {
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { PageLayout } from "../../components/layout/page-layout/PageLayout";
import { ProblemDetails } from "../../components/solvers/Graph/ProblemDetails";
import { NodeSelectorProvider } from "../../components/solvers/Graph/state/NodeSelectorProvider";
import { useNodeDetails } from "../../components/solvers/Graph/state/useNodeDetails";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";
import { NodeDetailsProvider } from "../../components/solvers/Graph/state/NodeDetailsProvider";

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


function KnapsackContent() {
  const [knapsackProblem, setKnapsackProblem] = useState("");
  const nodeDetails = useNodeDetails();
  console.log('nodeDetails.problemDtos', nodeDetails.problemDtos);


  return (
    <PageLayout
      leftSidebar={
        <Flex direction="column" width="100%" height="100%" gap="8px">
          <Heading as="h4" size="md">
            Knapsack Solver
          </Heading>

          <Card>
            <CardBody>
              <Text color="text" align="justify">
                In the 0-1 knapsack problem, we are given a list of items,
                each with a weight and a value, and the maximum weight that
                the knapsack can hold. The goal is to find the subset of items
                that maximizes the total value while keeping the total weight
                below the maximum weight. Example problems and an explanation
                of the input format can be found{" "}
                <Link
                  href="https://github.com/ProvideQ/knapsack-problems"
                  color={"blue.400"}
                >
                  here
                </Link>
                .
              </Text>
            </CardBody>
          </Card>

          <TextInputMask
            problemTypeId="Knapsack"
            text={knapsackProblem}
            setText={setKnapsackProblem}
            textPlaceholder="Enter your knapsack problem"
          />
        </Flex>
      }
      rightSidebar={nodeDetails.problemDtos.map((problemDto) => (
        <div key={problemDto.id}>
          <ProblemDetails problemDto={problemDto} />
          <Divider />
        </div>
      ))}
    >
      <SolverConfiguration
        problemTypeId="Knapsack"
        problemInput={knapsackProblem}
      />
    </PageLayout>
  )
}
