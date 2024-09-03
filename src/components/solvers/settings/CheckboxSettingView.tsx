import { Checkbox } from "@chakra-ui/react";
import { CheckboxSetting } from "../../../api/data-model/SolverSettings";
import { SettingProps } from "./SettingProps";
import { Disabled } from "./SettingsView";

export const CheckboxSettingView = (
  props: SettingProps<CheckboxSetting & Disabled>
) => {
  return (
    <Checkbox
      disabled={props.setting.disabled}
      defaultChecked={props.setting.state}
      onChange={(e) => {
        props.updateSetting({
          ...props.setting,
          state: e.target.checked,
        });
      }}
    />
  );
};
