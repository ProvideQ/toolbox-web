import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from 'prismjs/components/prism-core';
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import 'prismjs/themes/prism.css'
import { Container } from "@chakra-ui/react";
import Prism from "prismjs";
import { SAT_language } from "./prism-SAT.js"

interface ISATTextAreaProps {

}

interface ISATTextAreaState {
    problemString: string;
}

export class SATTextArea extends React.Component<ISATTextAreaProps, ISATTextAreaState> {
    constructor(props: ISATTextAreaProps) {
        super(props);
        this.state = { problemString: "" };
    }

    render() {
        return (
        <Container border="1px" borderColor="#AAAAAA" borderRadius="10px">
            <Editor
                value={this.state.problemString}
                onValueChange={code => this.setState({problemString: code})}
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