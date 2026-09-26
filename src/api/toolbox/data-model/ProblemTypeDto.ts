export interface ProblemTypeDto {
  id: string;
  description?: string;
  attributes: string[];
}

export function getHumanReadableTypeId(typeId: string): string {
  return typeId.replaceAll(/([a-z])([A-Z])/g, "$1 $2");
}
