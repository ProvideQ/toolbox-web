import { NextPage } from "next";
import React from "react";
import { FeatureModel } from "../../components/solvers/FeatureModel/FeatureModel";

const FeatureModelAnomaly: NextPage = () => {
    return (
        <FeatureModel type="anomaly"/>
    );
};
export default FeatureModelAnomaly;