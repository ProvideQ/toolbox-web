import { Divider, Heading, Spacer, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { SAT_language } from "../../components/solvers/SAT/prism-SAT";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";
import { LogicalExpressionValidator } from "../../converter/dimacs/LogicalExpressionValidator";

const SAT: NextPage = () => {
  const logicalExpressionValidator = new LogicalExpressionValidator();

  const [logicalExpressionString, setLogicalExpressionString] = useState("");

  return (
    <Layout>
      <Heading as="h1">SAT Solver</Heading>
      <Text color="text" align="justify">
        For a given Boolean formula, this algorithm checks if there is an
        interpretation that satisfies it. You can enter any boolean formula with
        any number of variables and combine them with boolean operators (i.e.,
        &quot;and&quot;, &quot;or&quot; and &quot;not&quot;).
      </Text>

      <Spacer />

      <TextInputMask
        textPlaceholder='Try "a and (not a or not b)"'
        text={logicalExpressionString}
        setText={setLogicalExpressionString}
        problemTypeId="sat"
        grammar={{
          grammar: SAT_language,
          language: "SAT_language",
        }}
        validate={(text) =>
          logicalExpressionValidator.validateLogicalExpression(text)
        }
      />

      <Divider />

      <SolverConfiguration
        problemTypeId="sat"
        problemInput={logicalExpressionString}
      />
    </Layout>
  );
};

export default SAT;
