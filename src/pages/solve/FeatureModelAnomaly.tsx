import { Box, Divider, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useState } from "react";
import { MultiSelect, Option } from "react-multi-select-component";
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
    <TextInputMask
      title="Feature Model Anomaly Solver"
      description="For a tree of features with cross tree constraints, the solver detects anomalies."
      textPlaceholder="Enter your feature model in UVL format"
      onTextChanged={setUvl}
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
          />
        </VStack>
      }
    />
  );
};
export default FeatureModelAnomaly;
