import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getInvalidProblemDto } from "../../api/data-model/ProblemDto";
import { ProblemState } from "../../api/data-model/ProblemState";
import { SolverSetting } from "../../api/data-model/SolverSettings";
import { fetchSolverSettings, postProblem } from "../../api/ToolboxAPI";
import { settingComponentMap } from "../solvers/settings/SettingsView";

export interface DemonstratorProps {
  demonstratorId: string;
  onSolved: (solution: string) => void;
}

enum DemonstratorState {
  IDLE,
  SOLVING,
  SOLVED,
}

function getHumanReadableState(state: DemonstratorState) {
  switch (state) {
    case DemonstratorState.IDLE:
      return "Go";
    case DemonstratorState.SOLVING:
      return (
        <HStack gap="1rem">
          <Text>Running</Text>
          <Spinner speed="1s" width="10px" height="10px" thickness="1px" />
        </HStack>
      );
    case DemonstratorState.SOLVED:
      return "Run again";
  }
}

const demonstratorTypeId = "demonstrator";

export const Demonstrator = (props: DemonstratorProps) => {
  const [settings, setSettings] = useState<SolverSetting[]>([]);
  const [state, setState] = useState<DemonstratorState>(DemonstratorState.IDLE);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchSolverSettings(demonstratorTypeId, props.demonstratorId).then(
      setSettings
    );
  }, [props.demonstratorId]);

  function updateSetting(newSetting: SolverSetting) {
    const index = settings.findIndex(
      (setting) => setting.name === newSetting.name
    );
    if (index !== -1) {
      settings.splice(index, 1, newSetting);
    }

    setSettings([...settings]);
  }

  return (
    <VStack spacing={5}>
      {settings.map((setting) => {
        const SettingComponent = settingComponentMap[setting.type];
        return (
          <FormControl
            key={setting.name}
            id={setting.name}
            isRequired={setting.required}
          >
            <Tooltip label={setting.description}>
              <FormLabel>{setting.name}</FormLabel>
            </Tooltip>
            <SettingComponent setting={setting} updateSetting={updateSetting} />
          </FormControl>
        );
      })}

      <Button
        bg="kitGreen"
        width="100%"
        _hover={{
          bg:
            state === DemonstratorState.SOLVING ? "kitGreen" : "kitGreenAlpha",
        }}
        textColor="white"
        onClick={() => {
          if (state === DemonstratorState.SOLVING) return;

          setState(DemonstratorState.SOLVING);
          postProblem(demonstratorTypeId, {
            ...getInvalidProblemDto(),
            input: "",
            solverId: props.demonstratorId,
            state: ProblemState.SOLVING,
            solverSettings: settings,
          }).then((problemDto) => {
            setState(DemonstratorState.SOLVED);
            if (problemDto.error) {
              setError(problemDto.error);
              props.onSolved("");
            } else if (problemDto.solution?.debugData) {
              setError(problemDto.solution.debugData);
              props.onSolved("");
            } else {
              setError("");
              props.onSolved(problemDto.solution.solutionData);
            }
          });
        }}
      >
        {getHumanReadableState(state)}
      </Button>

      {error && <Text color="red">{error}</Text>}
    </VStack>
  );
};
