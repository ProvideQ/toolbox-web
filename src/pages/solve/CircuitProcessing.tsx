import { Heading, Link, Spacer, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { PageLayout } from "../../components/layout/page-layout/PageLayout";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const CircuitProcessing: NextPage = () => {
  const [qasmString, setQASMString] = useState("");

  return (
    <PageLayout>
      <Heading as="h1">OpenQASM Processing</Heading>
      <Text color="text" align="justify">
        Give a circuit in{" "}
        <Link href="https://en.wikipedia.org/wiki/OpenQASM" color={"blue.400"}>
          OpenQASM
        </Link>{" "}
        to process it. You can choose to execute the circuit, optimize it or
        apply error mitigation strategies.
      </Text>

      <Spacer />

      <TextInputMask
        problemTypeId="circuit-processing"
        textPlaceholder="Enter your OpenQASM code"
        text={qasmString}
        setText={setQASMString}
      />

      <SolverConfiguration
        problemTypeId="circuit-processing"
        problemInput={qasmString}
      />
    </PageLayout>
  );
};
export default CircuitProcessing;
