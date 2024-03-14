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
        tags={["QAOA", "simulated"]}
        problemName="MaxCut"
        description="For a given undirected, weighted graph, this algorithm finds a cut that is a maximum in some way or another."
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        href="solve/FeatureModelAnomaly"
        new={false}
        tags={["sub-routines"]}
        problemName="Feature Model Anomaly"
        description="For a given feature model, check for Void Feature Model, Dead Features, False-Optional Features, Redundant Constraints.."
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        href="solve/VRP"
        new={true}
        tags={["sub-routines", "simulated"]}
        problemName="Vehicle Routing Problem"
        description="For a given set of customers and a fleet of vehicles, this algorithm finds the optimal set of routes for the vehicles to traverse in order to deliver to the customers."
      />
    </GridItem>
  </Grid>
);
