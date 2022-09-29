import React, {useState} from "react";
import { Spinner } from "@chakra-ui/react";
import { Container } from "../Container";
import { GoButton } from "./buttons/GoButton";

export const ProgressHandler = () => {
    const [wasClicked, setClicked] = useState(false);

    if (wasClicked) {
        return (<Container><Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='teal.500'
            size='xl'/></Container>); //TODO: replace with progress view
    } else {
        return <GoButton clicked={() => setClicked(true)}/>
    }
}