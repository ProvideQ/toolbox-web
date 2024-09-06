import { Grid, GridItem, GridProps } from "@chakra-ui/react";
import { DemonstratorCard } from "./DemonstratorCard";

export const DemonstratorChooser = (props: GridProps) => (
  <Grid templateColumns="repeat(2, 1fr)" gap={6} {...props}>
    <GridItem>
      <DemonstratorCard
        new={true}
        href="demonstrate/MixedIntegerProgramming"
        title="Mixed Integer Programming"
        description="The MIP problem is a mathematical optimization problem where some or all of the variables are restricted to be integers."
      />
    </GridItem>
  </Grid>
);
