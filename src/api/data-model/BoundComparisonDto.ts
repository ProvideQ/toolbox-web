import { BoundDto, getInvalidBoundDto } from "./BoundDto";
import { getInvalidSolutionObject, SolutionObject } from "./SolutionObject";

export interface BoundComparisonDto {
  comparison: number;
  bound: BoundDto;
  solution: SolutionObject;
}

export function getInvalidBoundComparisonDto(): BoundComparisonDto {
  return {
    bound: getInvalidBoundDto(),
    comparison: 0,
    solution: getInvalidSolutionObject(),
  };
}
