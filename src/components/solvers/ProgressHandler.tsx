import React from "react";
import { Spinner } from "@chakra-ui/react";
import { Container } from "../Container";
import { GoButton } from "./buttons/GoButton";

interface ProgressHandlerState {
    wasClicked: boolean;
}

export class ProgressHandler extends React.Component<{}, ProgressHandlerState> {
    constructor() {
        super({});

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