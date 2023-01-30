import React, {useEffect, useState} from "react";
import {Container, Select, Text} from "@chakra-ui/react";
import {fetchSolvers} from "../../api/ToolboxAPI";
import {ProblemSolver} from "./ProblemSolver";

export interface SolverPickerProps {
    problemType: string;
    setSolver?: (solver: ProblemSolver | undefined) => void;
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

    const getSolvers = () => {
        return (
            <Select onChange={e =>
                props.setSolver?.(e.target.selectedIndex == 0 || e.target.selectedIndex > solvers.length
                    ? undefined
                    : solvers[e.target.selectedIndex - 1])
            }>
                <option>Use MetaSolver strategy</option>
                <optgroup label="Specific Solvers">
                    {solvers.map((s: ProblemSolver) => (
                        <option key={s.id}>{s.name}</option>
                    ))}
                </optgroup>
            </Select>
        )
    }

    return (
        <Container>
            <Text>Which solver should be used?</Text>
            {loadingSolvers
                ? <Text>Loading solvers...</Text>
                : getSolvers()
            }
        </Container>
    );
}