import { Grid, GridItem, GridProps } from "@chakra-ui/react";
import { ProblemCard } from "./ProblemCard";

export const ProblemChooser = (props: GridProps) => (
  <Grid templateColumns="repeat(2, 1fr)" gap={6} {...props}>
    <GridItem>
      <ProblemCard
        href="solve/SAT"
        new={false}
        tags={["simulated"]}
        problemName="SAT"
        description="For a given Boolean formula, this algorithm checks if there exists an interpretation that satisfies it."
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        href="solve/MaxCut"
        new={false}
        tags={["QAOA"]}
        problemName="MaxCut"
        description="For a given undirected, weighted graph, this algorithm finds a cut that is a maximum in some way or another."
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        href="solve/FeatureModelAnomaly"
        new={false}
        tags={["sub-routines", "SAT"]}
        problemName="Feature Model Anomaly"
        description="Check whether a given feature model in the UVL format is void or if it has dead features."
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        href="solve/QUBO"
        new={true}
        tags={["QAOA", "Annealing"]}
        problemName="QUBO"
        description="For a quadratic term with binary decision variables, find the variable assignment minimizing the term."
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        href="solve/VehicleRouting"
        new={true}
        tags={["sub-routines", "QUBO", "Clustering"]}
        problemName="Vehicle Routing"
        description="What is the optimal set of routes for a fleet of vehicles to traverse in order to deliver to a given set of customers?"
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        href="solve/TSP"
        new={true}
        tags={["sub-routines", "qubo"]}
        problemName="Traveling Salesperson Problem"
        description="Given a list of cities and the distances between them, find the shortest possible route that visits each city exactly once and returns to the origin city."
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        href="solve/Knapsack"
        new={true}
        tags={["QAOA"]}
        problemName={"Knapsack"}
        description="Given a list of items with weights and values, find a subset of items with the highest total value up to a certain weight limit."
      />
    </GridItem>
  </Grid>
);
