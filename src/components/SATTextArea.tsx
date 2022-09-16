import React from "react";
import Editor from "react-simple-problemString-editor";
import { highlight, languages } from 'prismjs/components/prism-core'

interface IProps {

}

interface IState {
    problemString: string;
}

class SATTextArea extends React.Component<IProps, IState> {
    constructor(props : { value: string }) {
        super(props);
        this.state = { problemString: "" };
    }

    render() {
        return <Editor
            value={this.state.problemString}
            highlight={(problemString : string) => highlight(problemString, languages.js)} // todo replace languages.js with custom language
            padding={10}
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
            }}
        />;
    }
}