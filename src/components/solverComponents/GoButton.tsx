import {Center, Button, Tooltip} from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface IGoButtonProps {
    clicked: MouseEventHandler<HTMLButtonElement>;
}

export const GoButton = (props: IGoButtonProps) => (
    <Center>
        <Tooltip label="Unleash the Qubits!" color="white">
            <Button colorScheme='teal' size='lg'
                    onClick={props.clicked} >
                GO!
            </Button>
        </Tooltip>
    </Center>
);
