export enum MetaSolverSettingType {
  RANGE = "RANGE",
  CHECKBOX = "CHECKBOX",
  TEXT = "TEXT",
  SELECT = "SELECT",
  INTEGER = "INTEGER",
}

export interface MetaSolverSetting {
  name: string;
  type: MetaSolverSettingType;
  title: string;
}

export interface RangeSetting extends MetaSolverSetting {
  min: number;
  max: number;
  value: number;
}

export interface CheckboxSetting extends MetaSolverSetting {
  state: boolean;
}

export interface TextSetting extends MetaSolverSetting {
  text: string;
}

export interface SelectSetting extends MetaSolverSetting {
  options: string[];
  selectedOption: string;
}

export interface IntegerSetting extends MetaSolverSetting {
  number: number;
}
