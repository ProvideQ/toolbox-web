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
  </Grid>
);
