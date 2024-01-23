import {
  Box,
  Container,
  Select,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { AuthenticationOptions } from "../../api/data-model/AuthenticationOptions";
import { ProblemSolver } from "../../api/data-model/ProblemSolver";
import { SolverChoice } from "../../api/data-model/SolveRequest";
import { SubRoutineDefinition } from "../../api/data-model/SubRoutineDefinition";
import { fetchSolvers, fetchSubRoutines } from "../../api/ToolboxAPI";
import TextWithLinks from "../TextWithLink";
import { SettingsView } from "./SettingsView";

export interface SolverPickerProps {
  problemType: string;

  /**
   * Only needed internally if this should show a sub routine
   */
  subRoutineDefinition?: SubRoutineDefinition;
  setSolverChoice: (solverChoice: SolverChoice) => void;
}

export const SolverPicker = (props: SolverPickerProps) => {
  const [loadingSolvers, setLoadingSolvers] = useState<boolean>(true);
  const [solvers, setSolvers] = useState<ProblemSolver[]>([]);
  const [subRoutines, setSubRoutines] = useState<
    SubRoutineDefinition[] | undefined
  >(undefined);
  const [solverChoice, setSolverChoice] = useState<SolverChoice>({
    requestedSubSolveRequests: {},
  });

  useEffect(() => {
    setSubRoutines(undefined);
    setLoadingSolvers(true);
    fetchSolvers(props.problemType).then((solvers: ProblemSolver[]) => {
      setSolvers(solvers);
      setLoadingSolvers(false);
    });
  }, [props.problemType]);

  function onSolverChanged(e: ChangeEvent<HTMLSelectElement>) {
    if (
      e.target.selectedIndex == 0 ||
      e.target.selectedIndex > solvers.length
    ) {
      let newSolverChoice: SolverChoice = {
        ...solverChoice,
        requestedSolverId: undefined,
      };

      setSolverChoice(newSolverChoice);
      props.setSolverChoice?.(newSolverChoice);

      setSubRoutines(undefined);
    } else {
      let solver = solvers[e.target.selectedIndex - 1];
      let newSolverChoice: SolverChoice = {
        ...solverChoice,
        requestedSolverId: solver.id,
      };

      setSolverChoice(newSolverChoice);
      props.setSolverChoice?.(newSolverChoice);

      fetchSubRoutines(props.problemType, solver.id).then((subRoutines) =>
        setSubRoutines(subRoutines)
      );
    }
  }

  const Authentication = (authenticationOptions: AuthenticationOptions) => {
    function updateAuthentication(token: string) {
      let newSolverChoice: SolverChoice = {
        ...solverChoice,
        authentication: {
          token: token,
        },
      };

      setSolverChoice(newSolverChoice);
      props.setSolverChoice?.(newSolverChoice);
    }

    return (
      <Container>
        <Text>This solver requires authentication</Text>
        {authenticationOptions.supportsToken ? (
          <Textarea
            onChange={(e) => updateAuthentication(e.target.value)}
            placeholder={`Enter your token for ${authenticationOptions.authenticationAgent} here`}
          />
        ) : null}

        <TextWithLinks text={authenticationOptions.authenticationDescription} />
      </Container>
    );
  };

  const SolverSelection = () => {
    return (
      <Container>
        {props.subRoutineDefinition == undefined ? null : (
          <Text>{props.subRoutineDefinition?.type} Subroutine:</Text>
        )}
        <Text>{props.subRoutineDefinition?.description}</Text>
        <Tooltip
          label="Use this dropdown to select the meta solver strategy"
          color="white"
        >
          <Select margin="2" onChange={onSolverChanged}>
            <option selected={solverChoice.requestedSolverId === undefined}>
              Automated Solver Selection
            </option>
            <optgroup label="Use Specific Solvers">
              {solvers.map((s: ProblemSolver) => (
                <option
                  key={s.id}
                  selected={solverChoice.requestedSolverId === s.id}
                >
                  {s.name}
                </option>
              ))}
            </optgroup>
          </Select>
        </Tooltip>
      </Container>
    );
  };

  let selectedSolver =
    solverChoice.requestedSolverId !== undefined
      ? solvers.find((s) => s.id === solverChoice.requestedSolverId)
      : null;

  return (
    <Container>
      {loadingSolvers ? <Text>Loading solvers...</Text> : <SolverSelection />}
      {selectedSolver?.authenticationOptions !== undefined &&
        selectedSolver?.authenticationOptions !== null &&
        Authentication(selectedSolver.authenticationOptions)}

      {solverChoice.requestedSolverId == undefined && (
        <SettingsView
          problemType={props.problemType}
          settingChanged={(settings) => {
            let newSolverChoice: SolverChoice = {
              ...solverChoice,
              requestedMetaSolverSettings: settings,
            };

            setSolverChoice(newSolverChoice);
            props.setSolverChoice(newSolverChoice);
          }}
        />
      )}

      {subRoutines != undefined && subRoutines.length != 0 && (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={2}>
          {subRoutines.map((def) => (
            <SolverPicker
              key={def.type}
              problemType={def.type}
              subRoutineDefinition={def}
              setSolverChoice={(subSolverChoice) => {
                let newSolverChoice: SolverChoice = {
                  ...solverChoice,
                  requestedSubSolveRequests: {
                    ...solverChoice.requestedSubSolveRequests,
                    [def.type]: subSolverChoice,
                  },
                };
                setSolverChoice(newSolverChoice);
                props.setSolverChoice?.(newSolverChoice);
              }}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};
