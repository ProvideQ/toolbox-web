import { Heading, Link, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { Option } from "react-multi-select-component";
import { Layout } from "../../components/layout/Layout";
import { SolverConfiguration } from "../../components/solvers/SolverConfiguration";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const anomalies: Option[] = [
  {
    label: "Void Feature Model",
    value: "feature-model-anomaly-void",
  },
  {
    label: "Dead Features",
    value: "feature-model-anomaly-dead",
  },
];

const FeatureModelAnomaly: NextPage = () => {
  const [uvl, setUvl] = useState<string>("");

  return (
    <Layout>
      <Heading as="h1">Feature Model Anomaly Solvers</Heading>
      <Text color="text" align="justify">
        For a tree of features with cross tree constraints, these solvers can
        detect various anomalies. Feature Models are given in the extended
        Universal Variablity Language (UVL). You can find information about UVL
        and feature model examples{" "}
        <Link
          href="https://universal-variability-language.github.io"
          color={"blue.400"}
        >
          here
        </Link>
        .
      </Text>

      <UnorderedList>
        <ListItem>
          A feature model is <b>void</b> if there is no valid selection of
          features.
        </ListItem>
        <ListItem>
          A feature is <b>dead</b> if the feature cannot be included in any
          valid feature selection.
        </ListItem>
      </UnorderedList>

      <TextInputMask
        problemTypeId="feature-model-anomaly-dead"
        textPlaceholder="Enter your feature model in UVL format"
        text={uvl}
        setText={setUvl}
      />

      {anomalies.map((option) => (
        <SolverConfiguration
          key={option.value}
          problemTypeId={option.value}
          problemTypeName={option.label}
          problemInput={uvl}
        />
      ))}
    </Layout>
  );
};
export default FeatureModelAnomaly;
