import { Box, Divider, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { ProgressHandler } from "../../components/solvers/ProgressHandler";
import { TextInputMask } from "../../components/solvers/TextInputMask";

const anomalies = [{
    label: "Void Feature Model",
    value: "feature-model/anomaly/void",
}, {
    label: "Dead Features",
    value: "feature-model/anomaly/dead",
}, {
    label: "False-Optional Features",
    value: "feature-model/anomaly/false-optional",
}, {
    label: "Redundant Constraints",
    value: "feature-model/anomaly/redundant-constraints",
}];

const FeatureModelAnomaly: NextPage = () => {
    const [uvl, setUvl] = useState<string>("");
    const [selectedAnomalies, setSelectedAnomalies] = useState<any[]>(anomalies);

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
                            labelledBy="Select anomalies"/>
                    </Box>

                    <Divider/>

                    <ProgressHandler
                        explicitSolvers={selectedAnomalies.map(a => a.value)}
                        problemUrl={`feature-model/anomaly`}
                        problemInput={uvl}/>
                </VStack>
            }/>
    );
};
export default FeatureModelAnomaly;