import React, {useEffect, useState} from "react";
import {Container, Icon, Select, Text} from "@chakra-ui/react";
import {fetchSolvers} from "../../api/ToolboxAPI";
import {ProblemSolver} from "./ProblemSolver";
import {InputButton} from "./buttons/InputButton";
import {TbBulb} from "react-icons/tb";

export interface SolverPickerProps {
    problemType: string;
    onSolverPicked?: (solver: ProblemSolver | undefined) => void;
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


    const solverClicked = (solver: ProblemSolver | undefined) => {
        if (props.onSolverPicked) {
            props.onSolverPicked(solver);
        }
    };

    const getSolvers = () => {
        return (
            <Select placeholder={`Select Solver for ${props.problemType}`}
                    onChange={e => solverClicked(solvers[e.target.selectedIndex - 1])} >
                {solvers.map((s: ProblemSolver) => (
                    <option key={s.id}>{s.name}</option>
                ))}
            </Select>
        )
    }

    return (
        <Container>
            <Text>Which solver should be used?</Text>
            <InputButton onClick={() => solverClicked(undefined)}
                         text="Use MetaSolver strategy"
                         toolTipText="MetaSolver automatically picks the best possible solver for your input"
                         icon={<Icon as={TbBulb}/>}/>

            {loadingSolvers
                ? <Text>Loading solvers...</Text>
                : getSolvers()
            }
        </Container>
    );
}