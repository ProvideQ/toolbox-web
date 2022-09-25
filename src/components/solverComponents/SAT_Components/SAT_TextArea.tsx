import 'prismjs/themes/prism-solarizedlight.css'
import React from "react";
import Editor from "react-simple-code-editor";
import { highlight } from 'prismjs/components/prism-core';
import { Container } from "@chakra-ui/react";
import { SAT_language } from "./prism-SAT.js"

interface ISAT_TextAreaProps {

}

interface ISAT_TextAreaState {
    problemString: string;
}

export class SAT_TextArea extends React.Component<ISAT_TextAreaProps, ISAT_TextAreaState> {
    constructor(props: ISAT_TextAreaProps) {
        super(props);
        this.state = { problemString: "" };
    }

    setProblemString(code: string): void {
        this.setState({problemString: code});
    }

    render() {
        return (
        <Container border="1px" borderColor="#AAAAAA" borderRadius="10px">
            <Editor
                value={this.state.problemString}
                onValueChange={code => this.setProblemString(code)}
                highlight={code => highlight(code, SAT_language)}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 24
                }}
            />
        </Container>
        );
    }
}