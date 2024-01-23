import { ProblemTypeSolutionId } from "./ProgressHandler";

export interface ProblemState<T> {
  /**
   * Problem input
   */
  problemInput: T;
  /**
   * Ids of the solutions of the problem input per problem type
   */
  solutionIds: ProblemTypeSolutionId;
}

export function getHistory<T>(problemTypes: string[]): ProblemState<T>[] {
  let historyItem = localStorage.getItem(getStoreId(problemTypes));
  if (historyItem === null) return [];

  return JSON.parse(historyItem);
}

export function storeHistory<T>(
  problemTypes: string[],
  history: ProblemState<T>[]
) {
  localStorage.setItem(getStoreId(problemTypes), JSON.stringify(history));
}

export function getStoreId(problemTypes: string[]) {
  return `problemStates-${problemTypes}`;
}
