import { Box, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuShield, LuShieldCheck } from "react-icons/lu";
import {
  canProblemSolverBeUpdated,
  ProblemDto,
} from "../../../api/toolbox/data-model/ProblemDto";
import {
  CheckboxSetting,
  GUARD_SETTING_NAME,
  SolverSetting,
} from "../../../api/toolbox/data-model/SolverSettings";
import { toolboxApi } from "../../../api/toolbox/ToolboxAPI";

export interface GuardToggleProps {
  problemDtos: ProblemDto<any>[];
  onChanged?: (problemId: string) => void;
}

function findGuardSetting(
  settings: SolverSetting[],
): CheckboxSetting | undefined {
  return settings.find((s) => s.name === GUARD_SETTING_NAME) as
    | CheckboxSetting
    | undefined;
}

export const GuardToggle = (props: GuardToggleProps) => {
  const typeId = props.problemDtos[0].typeId;
  const solverId = props.problemDtos[0].solverId;

  const [defaultSettings, setDefaultSettings] = useState<SolverSetting[]>([]);
  const [pending, setPending] = useState<{
    state: boolean;
    problemDtos: ProblemDto<any>[];
  }>();

  useEffect(() => {
    if (!solverId) return;

    toolboxApi
      .fetchSolverSettings(typeId, solverId)
      .then(setDefaultSettings)
      .catch(() => setDefaultSettings([]));
  }, [typeId, solverId]);

  const defaultGuard = findGuardSetting(defaultSettings);
  if (!solverId || !defaultGuard) return null;

  const pendingState =
    pending?.problemDtos === props.problemDtos ? pending.state : undefined;
  const enabled =
    pendingState ??
    findGuardSetting(props.problemDtos[0].solverSettings)?.state ??
    defaultGuard.state;
  const editable = props.problemDtos.every(canProblemSolverBeUpdated);

  function toggle() {
    if (!editable) return;

    const newState = !enabled;
    setPending({ state: newState, problemDtos: props.problemDtos });

    Promise.all(
      props.problemDtos.map((problemDto) => {
        const settings = defaultSettings
          .filter(
            (s) =>
              !problemDto.solverSettings.some((own) => own.name === s.name),
          )
          .concat(problemDto.solverSettings)
          .map((s) =>
            s.name === GUARD_SETTING_NAME
              ? ({ ...s, state: newState } as CheckboxSetting)
              : s,
          );

        return toolboxApi
          .patchProblem(problemDto.typeId, problemDto.id, {
            solverSettings: settings,
          })
          .then((dto) => props.onChanged?.(dto.id));
      }),
    ).catch(() => setPending(undefined));
  }

  const label =
    (enabled
      ? "Guard active: invalid results are rejected and the sub-routines are retried"
      : "Guard inactive: results are returned without validity check") +
    (editable ? " Click to toggle" : "");

  return (
    <Tooltip hasArrow label={label} placement="bottom">
      <Box
        as="button"
        aria-label={enabled ? "Deactivate guard" : "Activate guard"}
        aria-pressed={enabled}
        onClick={toggle}
        cursor={editable ? "pointer" : "default"}
        color={enabled ? "green.500" : "gray.400"}
        _hover={editable ? { color: enabled ? "green.600" : "gray.600" } : {}}
        display="flex"
        alignItems="center"
      >
        {enabled ? <LuShieldCheck size="1.4rem" /> : <LuShield size="1.4rem" />}
      </Box>
    </Tooltip>
  );
};
