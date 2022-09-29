import React, { MouseEventHandler, ReactElement } from "react";
import { Tooltip, Button } from "@chakra-ui/react";

interface InputButtonProps {
    icon: ReactElement;
    text: string;
    toolTipText: string;
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export const InputButton = (props: InputButtonProps) => (
    <Tooltip label={props.toolTipText} color='white'>
        <Button colorScheme='teal' onClick={props.onClick} rightIcon={props.icon} size="lg" >
            {props.text}
        </Button>
    </Tooltip>
);