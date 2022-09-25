import { Spinner } from "@chakra-ui/react";
import React from "react";
import { Container } from "../Container";
import { GoButton } from "./GoButton";

interface IProgressHandlerProps {

}

interface IProgressHandlerState {
    wasClicked: boolean;
}

export class ProgressHandler extends React.Component<IProgressHandlerProps, IProgressHandlerState> {
    constructor(props: IProgressHandlerProps) {
        super(props);

        this.state = {
            wasClicked: false,
        }

        this.onGoClicked = this.onGoClicked.bind(this);
    }

    onGoClicked() {
        this.setState({
            wasClicked: true
        });
    }

    render() {
        if (this.state.wasClicked) {
            return (<Container><Spinner 
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='teal.500'
                                    size='xl'/></Container>); //TODO: replace with progress view
        } else {
            return <GoButton clicked={this.onGoClicked}/>
        }
    }
}