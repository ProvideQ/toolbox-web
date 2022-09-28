import 'prismjs/themes/prism-solarizedlight.css' //TODO: use custom styling
import React from "react";
import Editor from "react-simple-code-editor";
import { highlight } from 'prismjs';
import { Container } from "@chakra-ui/react";
import { SAT_language } from "./prism-SAT"

interface ISAT_TextAreaState {
    problemString: string;
}

export class TextArea extends React.Component<{}, ISAT_TextAreaState> {
    constructor() {
        super({});
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
                highlight={code => highlight(code, SAT_language, "SAT_language")}
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