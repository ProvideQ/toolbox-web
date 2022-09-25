import React, { MouseEventHandler, ReactElement } from "react";
import { Tooltip, Button } from "@chakra-ui/react";


export const InputButton = (props: { icon: ReactElement, text: string, toolTipText: string, onClick?: MouseEventHandler<HTMLButtonElement> | undefined }) => (
    <Tooltip label={props.toolTipText} color='white'>
        <Button colorScheme='teal' onClick={props.onClick} rightIcon={props.icon}
                width="200px" size="lg" >
            {props.text}
        </Button>
    </Tooltip>
);