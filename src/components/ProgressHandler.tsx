import { Button } from "@chakra-ui/react";
import React from "react";
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
            return (
                <Button colorScheme='teal' size='lg'>
                    I was clicked!
                </Button>);
        } else {
            return <GoButton clicked={this.onGoClicked}/>
        }
    }
}