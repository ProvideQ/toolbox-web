/**
 * A sub-routine definition describes which problem type needs to be solved by a
 * sub-routine and why it needs to be solved.
 */
export interface SubRoutineDefinition {
  /**
   * Identifies the type of problem that needs to be solved with the described
   * sub-routine.
   */
  problemTypeId: string;
  /**
   * Describes why this sub-routine is required to solve a bigger problem.
   */
  description: string;
}
