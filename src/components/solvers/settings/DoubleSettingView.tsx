import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { RangeSetting } from "../../../api/data-model/SolverSettings";

import { SettingProps } from "./SettingProps";

export const DoubleSettingView = (
  props: SettingProps<RangeSetting & { disabled: boolean }>
) => {
  let total = props.setting.max - props.setting.min;
  let marks = 5;
  let markStep = total / (marks - 1);

  return (
    <Slider
      isDisabled={props.setting.disabled}
      min={props.setting.min}
      max={props.setting.max}
      value={props.setting.value}
      step={1}
      onChange={(v) => {
        props.updateSetting({
          ...props.setting,
          value: v,
        });
      }}
    >
      {Array.from({ length: marks }, (_, i) => {
        const stepValue = Math.round(i * markStep);

        return (
          <SliderMark key={i} value={stepValue}>
            {stepValue}
          </SliderMark>
        );
      })}
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>

      <SliderThumb />
    </Slider>
  );
};
