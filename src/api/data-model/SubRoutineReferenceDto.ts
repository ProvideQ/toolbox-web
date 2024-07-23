import { SubRoutineDefinitionDto } from "./SubRoutineDefinitionDto";

export interface SubRoutineReferenceDto {
  subRoutine: SubRoutineDefinitionDto;
  subProblemIds: string[];
}
