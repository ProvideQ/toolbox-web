import { Center, Divider } from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useState } from "react";
import { Container } from "../../components/Container";
import { GraphArea } from "../../components/solvers/Graph/GraphArea";
import { ProgressHandler } from "../../components/solvers/ProgressHandler";
import { TextInputMask } from "../../components/solvers/TextInputMask";
import { parseGML } from '../../converter/graph/gml/GmlParser';

const MaxCut: NextPage = () => {
    const [graphData, setGraphData] = useState<any>(null);
    const [graphString, setGraphString] = useState("");

    function change(x: string): void {
        setGraphString(x);
        let data = parseGML(x);
        setGraphData(data);
    }

    return (
        <TextInputMask
            title="MaxCut Solver"
            description="For a given undirected, weighted graph, this algorithm finds a cut that is a maximum in some way or another."
            textPlaceholder="Enter your graph in GML format"
            onTextChanged={change}
            body={
                <Container>
                    <Center>
                        <GraphArea graphData={graphData} graphHeight={500} graphWidth={500}/>
                    </Center>

                    <Divider/>
                    <ProgressHandler
                        problemUrl="max-cut"
                        problemInput={graphString}/>
                </Container>
            }/>
    );
};
export default MaxCut;