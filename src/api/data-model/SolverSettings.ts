export enum SolverSettingType {
  INTEGER = "INTEGER",
  DOUBLE = "DOUBLE",
  CHECKBOX = "CHECKBOX",
  TEXT = "TEXT",
  SELECT = "SELECT",
}

export interface SolverSetting {
  name: string;
  description: string;
  type: SolverSettingType;
  required: boolean;
}

export interface RangeSetting extends SolverSetting {
  min: number;
  max: number;
  value: number;
}

export interface CheckboxSetting extends SolverSetting {
  state: boolean;
}

export interface TextSetting extends SolverSetting {
  text: string;
}

export interface SelectSetting extends SolverSetting {
  options: string[];
  selectedOption: string;
}
