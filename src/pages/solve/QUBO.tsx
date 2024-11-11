import { Code, Heading, Spacer, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const QUBO: NextPage = () => {
  const [quboTerm, setQuboTerm] = useState("");

  return (
    <Layout>
      <Heading as="h1">QUBO Solver</Heading>
      <Text color="text" align="justify">
        In the Quadratic Unconstrained Binary Optimization problem, we try to
        find the assignment for a finite amount of <Code>0/1</Code> decision
        variables that minimizes a given quadratic term with these variables.
        The problem statement is given in the LP format and all solvers will
        present a variable assigment as a solution.
      </Text>

      <Spacer />

      <TextInputMask
        problemTypeId="qubo"
        text={quboTerm}
        setText={setQuboTerm}
        textPlaceholder={"Enter your QUBO problem in LP format"}
      />

      <SolverConfiguration problemTypeId="qubo" problemInput={quboTerm} />
    </Layout>
  );
};

export default QUBO;
