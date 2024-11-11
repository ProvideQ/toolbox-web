import { Textarea } from "@chakra-ui/react";
import { TextSetting } from "../../../api/data-model/SolverSettings";
import { SettingProps } from "./SettingProps";
import { Disabled } from "./SettingsView";

export const TextSettingView = (
  props: SettingProps<TextSetting & Disabled>
) => {
  return (
    <Textarea
      disabled={props.setting.disabled}
      value={props.setting.text}
      onChange={(e) => {
        props.updateSetting({
          ...props.setting,
          text: e.target.value,
        });
      }}
    />
  );
};
