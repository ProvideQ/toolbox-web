import {
  Box,
  Divider,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { MultiSelect, Option } from "react-multi-select-component";
import { Layout } from "../../components/layout/Layout";
import { ProgressHandler } from "../../components/solvers/ProgressHandler";
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
  const [selectedAnomalies, setSelectedAnomalies] =
    useState<Option[]>(anomalies);

  return (
    <Layout>
      <Heading as="h1">Feature Model Anomaly Solvers</Heading>
      <Text color="text" align="justify">
        For a tree of features with cross tree constraints, these solvers can
        detect various anomalies. Feature Models are given in the extended
        Universal Variablity Language (UVL).
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
        text={uvl}
        onTextChanged={setUvl}
        textPlaceholder="Enter your feature model in UVL format"
        body={
          <VStack>
            <Box width="300px">
              <MultiSelect
                options={anomalies}
                value={selectedAnomalies}
                onChange={setSelectedAnomalies}
                labelledBy="Select anomalies"
              />
            </Box>

            <Divider />

            <ProgressHandler
              problemTypes={selectedAnomalies.map((option) => option.value)}
              problemInput={uvl}
              setProblemInput={setUvl}
            />
          </VStack>
        }
      />
    </Layout>
  );
};
export default FeatureModelAnomaly;
