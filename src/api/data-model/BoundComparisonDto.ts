import { BoundDto } from "./BoundDto";
import { SolutionObject } from "./SolutionObject";

export interface BoundComparisonDto {
  comparison: number;
  bound: BoundDto;
  solution: SolutionObject;
}
