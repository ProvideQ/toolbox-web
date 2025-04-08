import { fetchSolverSettings } from "../ToolboxAPI";
import { ProblemDto } from "./ProblemDto";

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

export async function solverSettingAnyRequiredIsUnfilled(
  problemDtos: ProblemDto<any>[]
): Promise<boolean> {
  const solverId = problemDtos[0].solverId;
  if (solverId === undefined) return false;

  const settings = await fetchSolverSettings(problemDtos[0].typeId, solverId);
  const requiredSettings = settings
    .filter((s) => s.required)
    .map((s) => s.name);

  if (requiredSettings.length === 0) return false;

  for (let problemDto of problemDtos) {
    const filledSettings = problemDto.solverSettings.map((s) => s.name);
    for (let requiredSetting of requiredSettings) {
      if (filledSettings.includes(requiredSetting) === false) {
        return true;
      }
    }
  }

  return false;
}
