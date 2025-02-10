import { Flex, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { Demonstrator } from "../../components/demonstrators/Demonstrator";
import { Layout } from "../../components/layout/Layout";

const MoleculeEnergySimulator: NextPage = () => {
  const [svg, setSvg] = useState<string | null>(null);

  return (
    <Layout>
      <Heading as="h1">Molecule Energy Simulator</Heading>
      <Text color="text" align="justify"></Text>

      <Demonstrator
        demonstratorId="edu.kit.provideq.toolbox.demonstrators.MoleculeEnergySimulator"
        onSolved={setSvg}
      />

      {svg && (
        <Flex justifyContent="center">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </Flex>
      )}
    </Layout>
  );
};

export default MoleculeEnergySimulator;
