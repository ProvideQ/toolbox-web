import { Heading, Spacer, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const UnsplittableMCF: NextPage = () => {
  const [unsplittableMCFTerm, setUnsplittableMCFTerm] = useState("");

  return (
    <Layout>
      <Heading as="h1">Unsplittable MCF Solver</Heading>
      <Text color="text" align="justify">
        For a given time-expanded network with products, orders, and capacity
        constraints, find optimal routing paths to fulfill customer orders
        through a Time-Expanded Network without splitting an order&#39;s demand.
      </Text>

      <Spacer />

      <TextInputMask
        problemTypeId="UnsplittableMCF"
        text={unsplittableMCFTerm}
        setText={setUnsplittableMCFTerm}
        textPlaceholder={"Enter your Unsplittable MCF problem in LP format"}
      />

      <SolverConfiguration
        problemTypeId="UnsplittableMCF"
        problemInput={unsplittableMCFTerm}
      />
    </Layout>
  );
};

export default UnsplittableMCF;
