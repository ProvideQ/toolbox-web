import React, { JSXElementConstructor, MouseEventHandler, ReactElement } from "react";
import { Tooltip, Button, HStack, Text } from "@chakra-ui/react";



export const ProblemInputButton = (props: {icon: ReactElement<any, string | JSXElementConstructor<any>>, text: string, toolTipText: string, onClick?: MouseEventHandler<HTMLButtonElement> | undefined}) => (
    <Tooltip label={props.toolTipText} color='white'>
        <Button colorScheme='teal' onClick={props.onClick}>
            <HStack>
                <Text color="text" align="justify">{props.text}</Text>
                {props.icon}
            </HStack>
        </Button>
    </Tooltip>
);