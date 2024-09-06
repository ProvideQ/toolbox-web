import { Flex, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { Demonstrator } from "../../components/demonstrators/Demonstrator";
import { Layout } from "../../components/layout/Layout";

const MixedIntegerProgramming: NextPage = () => {
  const [svg, setSvg] = useState<string | null>(null);

  return (
    <Layout>
      <Heading as="h1">Mixed Integer Programming Demonstrator</Heading>
      <Text color="text" align="justify">
        This demonstrator will provide a visual benchmark representation of the
        Mixed Integer Programming (MIP) problem based on a variable number of
        variables and repetitions. The MIP problem is a mathematical
        optimization problem where some or all of the variables are restricted
        to be integers.
      </Text>

      <Demonstrator
        demonstratorId="edu.kit.provideq.toolbox.demonstrators.CplexMipDemonstrator"
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

export default MixedIntegerProgramming;
