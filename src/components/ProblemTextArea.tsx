import { Textarea } from "@chakra-ui/react";
import React from "react";

interface IProps {

}

interface IState {
    problemString: string;
}


export class ProblemTextArea extends React.Component<IProps, IState> {
    constructor() {
        super({});
        this.state = {
            problemString: ""
        };
    } 

    reformatInput(inputText: string): string {
        return inputText.toUpperCase();
    }

    render() {
        let handleInputChange = (e: any) => {
            let inputValue = e.target.value;
            inputValue = this.reformatInput(inputValue);
            this.setState({problemString: inputValue});            
        }
        return <Textarea placeholder="(p∨u∨t)∧(y∨o∨u∨¬r)∧(p∨r∨¬o∨b∨l∨e∨¬m)∧(h∨¬e∨r∨e)" value={this.state.problemString} onChange={handleInputChange} />
    }
}