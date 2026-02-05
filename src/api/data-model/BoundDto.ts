import { BoundType } from "./BoundType";

export interface BoundDto {
  value: number;
  boundType: BoundType;
  executionTime: number;
}

export function getInvalidBoundDto(): BoundDto {
  return {
    value: NaN,
    boundType: BoundType.UPPER,
    executionTime: -1,
  };
}
