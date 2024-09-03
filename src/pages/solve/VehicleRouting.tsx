import { Heading, Link, Spacer, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const VehicleRouting: NextPage = () => {
  const [vrp, setVrp] = useState("");

  return (
    <Layout>
      <Heading as="h1">Vehicle Routing Solver</Heading>
      <Text color="text" align="justify">
        The Vehicle Routing Problem (VRP) is a combinatorial optimization
        problem that seeks to find the best set of routes for a fleet of
        vehicles to service a set of customers. The problem can be specified in
        the VRP format and all solvers will return a solution in the same
        format. Example VRP problems can be found in the{" "}
        <Link
          href="http://vrp.galgos.inf.puc-rio.br/index.php/en"
          color={"blue.400"}
        >
          CVRPLib
        </Link>
        .
      </Text>

      <Spacer />

      <TextInputMask
        problemTypeId="vrp"
        text={vrp}
        setText={setVrp}
        textPlaceholder={"Enter your Vehicle Routing problem in vrp format"}
      />

      <SolverConfiguration problemTypeId="vrp" problemInput={vrp} />
    </Layout>
  );
};

export default VehicleRouting;
