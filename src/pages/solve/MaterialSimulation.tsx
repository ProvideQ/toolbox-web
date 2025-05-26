import { Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const MaterialSimulation: NextPage = () => {
  const [molecule, setMolecule] = useState("");

  return (
    <Layout>
      <Heading as="h1">Knapsack Solver</Heading>

      <Text color="text" align="justify">
        Enter a molecule to get chemical information about its behavior on a
        quantum scale.
      </Text>

      <TextInputMask
        problemTypeId="knapsack"
        text={molecule}
        setText={setMolecule}
        textPlaceholder="Enter your molecule to simulate"
      />

      <SolverConfiguration
        problemTypeId="material-simulation"
        problemInput={molecule}
      />
    </Layout>
  );
};

export default MaterialSimulation;
