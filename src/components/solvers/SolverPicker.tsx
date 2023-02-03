import React, {useEffect, useState} from "react";
import {Select, Text, Tooltip} from "@chakra-ui/react";
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
                <option>Automated Solver Selection</option>
                <optgroup label="Use Specific Solvers">
                    {solvers.map((s: ProblemSolver) => (
                        <option key={s.id}>{s.name}</option>
                    ))}
                </optgroup>
            </Select>
        )
    }

    return (
        <Tooltip label="Use this dropdown to select the meta solver strategy" color="white">
            {loadingSolvers
                ? <Text>Loading solvers...</Text>
                : getSolvers()
            }
        </Tooltip>
    );
}