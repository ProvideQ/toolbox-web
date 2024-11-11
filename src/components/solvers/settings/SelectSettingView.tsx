import { Select } from "@chakra-ui/react";
import { SelectSetting } from "../../../api/data-model/SolverSettings";
import { SettingProps } from "./SettingProps";
import { Disabled } from "./SettingsView";

export const SelectSettingView = (
  props: SettingProps<SelectSetting & Disabled>
) => {
  return (
    <Select
      disabled={props.setting.disabled}
      value={props.setting.selectedOption}
      onChange={(e) => {
        props.updateSetting({
          ...props.setting,
          selectedOption: e.target.value,
        });
      }}
    >
      {props.setting.options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </Select>
  );
};
