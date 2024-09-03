import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { RangeSetting } from "../../../api/data-model/SolverSettings";

import { SettingProps } from "./SettingProps";

export const IntegerSettingView = (
  props: SettingProps<RangeSetting & { disabled: boolean }>
) => {
  return (
    <NumberInput
      isDisabled={props.setting.disabled}
      step={1}
      value={props.setting.value}
      min={props.setting.min}
      max={props.setting.max}
      onChange={(e) => {
        props.updateSetting({
          ...props.setting,
          value: parseInt(e),
        });
      }}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};
