import React, {useEffect, useState} from "react";
import {Button, Container, Icon, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import {fetchSolvers} from "../../api/ToolboxAPI";
import {ProblemSolver} from "./ProblemSolver";
import {InputButton} from "./buttons/InputButton";
import {TbBulb} from "react-icons/tb";

export interface SolverPickerProps {
    problemType: string;
    onSolverPicked?: (solver: ProblemSolver | null) => void;
}

export const SolverPicker = (props: SolverPickerProps) => {
    const [loadingSolvers, setLoadingSolvers] = useState<boolean>(true);
    const [solvers, setSolvers] = useState<ProblemSolver[]>([]);

    useEffect(() => {
        setLoadingSolvers(true);
        fetchSolvers(props.problemType)
            .then(solvers => {
                setSolvers(solvers);
                setLoadingSolvers(false);
            })
    }, [props.problemType]);


    const solverClicked = (solver: ProblemSolver | null) => {
        if (props.onSolverPicked) {
            props.onSolverPicked(solver);
        }
    };

    const getSolvers = () => {
        return solvers.map((s: ProblemSolver) => (
            <ListItem key={s.id}>
                <Button key={s.id} onClick={() => solverClicked(s)}>{s.name}</Button>
            </ListItem>)
        );
    }

    return (
        <Container>
            <Text>Which solver should be used?</Text>
            <InputButton onClick={() => solverClicked(null)}
                         text="Use MetaSolver strategy"
                         toolTipText="MetaSolver automatically picks the best possible solver for your input"
                         icon={<Icon as={TbBulb}/>}/>

            <UnorderedList>
                {loadingSolvers
                    ? <ListItem>Loading solvers...</ListItem>
                    : getSolvers()
                }
            </UnorderedList>
        </Container>
    );
}