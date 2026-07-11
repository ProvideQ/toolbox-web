import { Flex, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { Demonstrator } from "../../components/demonstrators/Demonstrator";
import { PageLayout } from "../../components/layout/page-layout/PageLayout";

const MoleculeEnergySimulator: NextPage = () => {
  const [svg, setSvg] = useState<string | null>(null);

  return (
    <PageLayout>
      <Heading as="h1">Molecule Energy Simulator</Heading>
      <Text color="text" align="justify">
        This demonstrator will compute the ground state energy for a given
        molecule using VQE algorithm. The molecule input is given in XYZ Format.
      </Text>

      <Demonstrator
        demonstratorId="edu.kit.provideq.toolbox.demonstrators.MoleculeEnergySimulator"
        onSolved={setSvg}
      />

      {svg && (
        <Flex justifyContent="center">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </Flex>
      )}
    </PageLayout>
  );
};

export default MoleculeEnergySimulator;
