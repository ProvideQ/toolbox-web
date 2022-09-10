import {Center, Button, CenterProps, Tooltip} from "@chakra-ui/react";

export const GoButton = (props: CenterProps) => (
    <Center>
        <Tooltip label="Unleash the Qubits!" color="white">
            <Button colorScheme='teal' size='lg'>
                GO!
            </Button>
        </Tooltip>
    </Center>
);
