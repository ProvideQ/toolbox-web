import { Grid, GridItem, GridProps } from '@chakra-ui/react'
import { ProblemCard } from './ProblemCard'

export const ProblemChooser = (props: GridProps) => (
  <Grid templateColumns="repeat(2, 1fr)" gap={6} {...props}>
    <GridItem>
      <ProblemCard
        new={true}
        qubits={23}
        speedup="superpolynomial"
        problemName="SAT"
        description='For a given Boolean formula, this algorithm checks if there exists an interpretation that satisfies it.'
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        new={false}
        qubits={12}
        speedup="polynomial"
        problemName="MaxCut"
        description='For a given undirected, weighted graph, this algorithm finds a cut that is a maximum in some way or another.'
      />
    </GridItem>
    <GridItem>
      <ProblemCard
        new={false}
        qubits={2}
        speedup="superpolynomial"
        problemName="DemoAlgorithm"
        description="I'm running out of ideas for descriptive texts, please help me!"
      />
    </GridItem>
  </Grid>
)
