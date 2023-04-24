import { Box, Container, Select, Text, Tooltip } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { fetchSolvers, fetchSubRoutines } from "../../api/ToolboxAPI";
import { SubRoutineDefinition } from "./SubRoutineDefinition";
import { ProblemSolver } from "./ProblemSolver";
import { SolverChoice } from "./SolveRequest";
import { SettingsView } from "./SettingsView";

export interface SolverPickerProps {
    problemUrlFragment: string;
    /**
     * Only needed internally - shows problem type
     */
    problemType?: string;
    /**
     * Only needed internally - shows problem description
     */
    problemDescription?: string;
    setSolveRequest: (subRoutines: SolverChoice) => void;
}

export const SolverPicker = (props: SolverPickerProps) => {
    const [loadingSolvers, setLoadingSolvers] = useState<boolean>(true);
    const [solvers, setSolvers] = useState<ProblemSolver[]>([]);
    const [subRoutines, setSubRoutines] = useState<SubRoutineDefinition[] | undefined>(undefined);
    const [solveRequest, setSolveRequest] = useState<SolverChoice>({
        requestedSubSolveRequests: {}
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
            solveRequest.requestedSolverId = undefined;
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

    const SolverSelection = () => {
        return (
            <Container>
                {props.problemType == undefined
                    ? null
                    : <Text>{props.problemType} Subroutine:</Text>}
                <Text>{props.problemDescription}</Text>
                <Tooltip label="Use this dropdown to select the meta solver strategy" color="white">
                    <Select margin="2" onChange={onSolverChanged}>
                        <option>Automated Solver Selection</option>
                        <optgroup label="Use Specific Solvers">
                            {solvers.map((s: ProblemSolver) => (
                                <option key={s.id}>{s.name}</option>
                            ))}
                        </optgroup>
                    </Select>
                </Tooltip>
            </Container>
        )
    }

    return (
        <Container>
            {loadingSolvers
                ? <Text>Loading solvers...</Text>
                : <SolverSelection/>}

            {solveRequest.requestedSolverId == undefined
                 ? <SettingsView problemUrl={props.problemUrlFragment}
                                settingChanged={settings => {
                                    solveRequest.requestedMetaSolverSettings = settings;
                                    props.setSolveRequest(solveRequest);
                                }}/>
                : null}

            {subRoutines == undefined || subRoutines.length == 0
                ? null
                : <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={2}>
                    {subRoutines.map(def =>
                        <SolverPicker
                            key={def.type}
                            problemUrlFragment={def.url}
                            problemType={def.type}
                            problemDescription={def.description}
                            setSolveRequest={subSolveRequest => {
                                solveRequest.requestedSubSolveRequests[def.type] = subSolveRequest;
                            }}/>)}
                </Box>}
        </Container>
    );
}