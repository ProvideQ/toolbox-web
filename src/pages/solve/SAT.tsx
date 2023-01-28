import Head from "next/head";
import React, {useState} from "react";
import type { NextPage } from "next";
import { Container } from "../../components/Container";
import { Main } from "../../components/Main";
import { SolverTitle } from "../../components/solvers/SolverTitle";
import { TextArea } from "../../components/solvers/SAT/TextArea";
import { Help } from "../../components/solvers/SAT/Help";
import { InputButtonPanel } from "../../components/solvers/buttons/InputButtonPanel";
import { ProgressHandler } from "../../components/solvers/ProgressHandler";
import { Text, Divider } from "@chakra-ui/react";
import { DimacsParser } from "../../converter/dimacs/DimacsParser";
import { LogicalExpressionParser } from "../../converter/dimacs/LogicalExpressionParser";

const SAT: NextPage = () => {
  const logicalExpressionParser = new LogicalExpressionParser();
  const dimacsParser = new DimacsParser();

  const [logicalExpressionString, setLogicalExpressionString] = useState("");
  const [errorString, setErrorString] = useState("");

  return (
    <Container minHeight="100vh">
      <Head>
        <title>ProvideQ</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        {/* TODO: replace favicon */}
      </Head>
      <SolverTitle title="SAT Solver" text="For a given Boolean formula, this algorithm checks if there exists an interpretation that satisfies it." />
      <Main mb="20vh">
          <TextArea problemString={logicalExpressionString}
                    setProblemString={(value) => {
                        setLogicalExpressionString(value);

                        try {
                            logicalExpressionParser.parseDimacs(value.toString());
                            setErrorString('');
                        } catch (e: any) {
                            setErrorString(e.message);
                        }
                    }}/>
          <Text backgroundColor="tomato" >{errorString}</Text>
        <InputButtonPanel
            helpBody={<Help/>}
            problemString={logicalExpressionString}
            setProblemString={setLogicalExpressionString}
            uploadString={(str: string) => {
                try {
                    return dimacsParser.parseLogicalExpression(str);
                } catch (e: any) {
                    return e.message;
                }
            }}
            downloadString={(str: string) => {
                let ret = '';
                try {
                    ret = logicalExpressionParser.parseDimacs(str);
                    setErrorString('');
                } catch (e: any) {
                    setErrorString(e.message);
                }
                return ret;
            }}
        />
        <Divider />
        <ProgressHandler
            problemType="sat"
            problemInput={logicalExpressionString} />
      </Main>
    </Container>
  );
};

export default SAT;