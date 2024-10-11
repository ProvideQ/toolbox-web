import { OptionalSolverSetting } from "./SettingsView";

export interface SettingProps<T extends OptionalSolverSetting> {
  setting: T;
  updateSetting: (newSetting: T) => void;
}
