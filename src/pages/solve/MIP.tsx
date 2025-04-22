import { Heading, Spacer, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const MIP: NextPage = () => {
  const [mipTerm, setMipTerm] = useState("");

  return (
    <Layout>
      <Heading as="h1">MIP Solver</Heading>
      <Text color="text" align="justify">
        In the Mixed Integer Programming (MIP) problem, we aim to find values
        for a finite number of decision variables—some of which are restricted
        to be integers—that minimize or maximize a given linear objective
        function, subject to a set of linear constraints. The problem is
        described using either the LP or MPS format, and all solvers will
        provide an assignment of values to the variables as a solution.
      </Text>

      <Spacer />

      <TextInputMask
        problemTypeId="mip"
        text={mipTerm}
        setText={setMipTerm}
        textPlaceholder={"Enter your MIP problem in LP / MPS format"}
      />

      <SolverConfiguration problemTypeId="mip" problemInput={mipTerm} />
    </Layout>
  );
};

export default MIP;
