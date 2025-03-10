import { Box, Button, Checkbox, Text, VStack } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { BiCheck } from "react-icons/bi";
import { ProblemDto } from "../../../api/data-model/ProblemDto";
import {
  SolverSetting,
  SolverSettingType,
} from "../../../api/data-model/SolverSettings";
import { fetchSolverSettings, patchProblem } from "../../../api/ToolboxAPI";
import { CheckboxSettingView } from "./CheckboxSettingView";
import { DoubleSettingView } from "./DoubleSettingView";
import { IntegerSettingView } from "./IntegerSettingView";
import { SelectSettingView } from "./SelectSettingView";
import { SettingProps } from "./SettingProps";
import { TextSettingView } from "./TextSettingView";

interface SettingsViewProps {
  problemDto: ProblemDto<any>;
  settingsChanged?: (newSettings: SolverSetting[]) => void;
}

export interface Disabled {
  disabled: boolean;
}

export type OptionalSolverSetting = SolverSetting & Disabled;

export const settingComponentMap: {
  [key in SolverSettingType]: FC<SettingProps<any>>;
} = {
  [SolverSettingType.INTEGER]: IntegerSettingView,
  [SolverSettingType.DOUBLE]: DoubleSettingView,
  [SolverSettingType.CHECKBOX]: CheckboxSettingView,
  [SolverSettingType.TEXT]: TextSettingView,
  [SolverSettingType.SELECT]: SelectSettingView,
};

export const SettingsView = (props: SettingsViewProps) => {
  const [settings, setSettings] = useState<OptionalSolverSetting[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!props.problemDto.solverId) return;

    fetchSolverSettings(
      props.problemDto.typeId,
      props.problemDto.solverId
    ).then((newSettings: SolverSetting[]) =>
      setSettings(
        // Use settings set on the problem, if they exist
        newSettings
          .filter(
            (s) =>
              !props.problemDto.solverSettings.find(
                (existingSetting) => existingSetting.name === s.name
              )
          )
          .map((s) => ({ ...s, disabled: !s.required }))
          .concat(
            props.problemDto.solverSettings.map((s) => ({
              ...s,
              disabled: false,
            }))
          )
      )
    );
  }, [props.problemDto]);

  if (settings.length == 0) {
    return null;
  }

  function updateSetting<T extends OptionalSolverSetting>(newSetting: T) {
    const index = settings.findIndex(
      (setting) => setting.name === newSetting.name
    );
    if (index !== -1) {
      settings.splice(index, 1, newSetting);
    }

    setSettings([...settings]);
  }

  function getSettingView(setting: OptionalSolverSetting) {
    const SettingComponent = settingComponentMap[setting.type];
    if (!SettingComponent) return null;

    return <SettingComponent setting={setting} updateSetting={updateSetting} />;
  }

  return (
    <Box margin={2} padding={2} borderWidth="1px" borderRadius="lg">
      {settings.map((setting) => (
        <VStack key={setting.name} align="left" paddingY="2">
          {setting.required ? (
            <Text>{setting.name}</Text>
          ) : (
            <Checkbox
              checked={!setting.disabled}
              defaultChecked={!setting.disabled}
              onChange={(e) =>
                updateSetting({ ...setting, disabled: !e.target.checked })
              }
            >
              {setting.name}
            </Checkbox>
          )}
          <Text fontSize="sm" fontStyle="italic">
            {setting.description}
          </Text>

          {getSettingView(setting)}
        </VStack>
      ))}

      <Button
        bg="kitGreen"
        width="100%"
        textColor="white"
        fontWeight="bold"
        _hover={{
          bg: "kitGreenAlpha",
        }}
        onClick={() => {
          patchProblem(props.problemDto.typeId, props.problemDto.id, {
            solverSettings: settings,
          }).then((r) => {
            props.settingsChanged?.(r.solverSettings);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
          });
        }}
      >
        Save
        {showSaved && <BiCheck />}
      </Button>
    </Box>
  );
};
