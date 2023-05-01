import {Box, Container, HStack, Select, Text, Tooltip} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { fetchSolvers, fetchSubRoutines } from "../../api/ToolboxAPI";
import { SubRoutineDefinition } from "./SubRoutineDefinition";
import { ProblemSolver } from "./ProblemSolver";
 import { SolveRequest, SubSolveRequest } from "./SolveRequest";

export interface SolverPickerProps {
    problemUrlFragment: string;
    problemDescription?: string;
    setSolveRequest: (subRoutines: SubSolveRequest) => void;
}

export const SolverPicker = (props: SolverPickerProps) => {
    const [loadingSolvers, setLoadingSolvers] = useState<boolean>(true);
    const [solvers, setSolvers] = useState<ProblemSolver[]>([]);
    const [subRoutines, setSubRoutines] = useState<SubRoutineDefinition[] | undefined>(undefined);
    const [solveRequest, setSolveRequest] = useState<SubSolveRequest>({
        requestedSubSolveRequests: new Map<string, SubSolveRequest>()
    });

    useEffect(() => {
        setSubRoutines(undefined);
        setLoadingSolvers(true);
        fetchSolvers(props.problemUrlFragment)
            .then((solvers: ProblemSolver[]) => {
                setSolvers(solvers);
                setLoadingSolvers(false);
            })
    }, [props.problemUrlFragment]);

    function onSolverChanged(e: ChangeEvent<HTMLSelectElement>) {
        if (e.target.selectedIndex == 0 || e.target.selectedIndex > solvers.length) {
            setSubRoutines(undefined);
            props.setSolveRequest?.(solveRequest)
        } else {
            let solver = solvers[e.target.selectedIndex - 1];
            solveRequest.requestedSolverId = solver.id;
            fetchSubRoutines(props.problemUrlFragment, solver.id)
                .then(subRoutines => setSubRoutines(subRoutines));
            props.setSolveRequest?.(solveRequest)
        }
    }

    const getSolvers = () => {
        return (
            <Container>
                <Text>{props.problemDescription}</Text>
                <Select onChange={onSolverChanged}>
                    <option>Automated Solver Selection</option>
                    <optgroup label="Use Specific Solvers">
                        {solvers.map((s: ProblemSolver) => (
                            <option key={s.id}>{s.name}</option>
                        ))}
                    </optgroup>
                </Select>
            </Container>
        )
    }

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={2}>
            <Tooltip label="Use this dropdown to select the meta solver strategy" color="white">
                {loadingSolvers
                    ? <Text>Loading solvers...</Text>
                    : getSolvers()
                }
            </Tooltip>

            <HStack>
                {subRoutines == undefined
                    ? null
                    : subRoutines.map(def => <SolverPicker
                        key={def.type}
                        problemUrlFragment={def.url}
                        problemDescription={def.description}
                        setSolveRequest={subSolveRequest => {
                            solveRequest.requestedSubSolveRequests.set(def.type, subSolveRequest);
                        }}/>)}
            </HStack>
        </Box>
    );
}