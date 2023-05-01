export interface SolverChoice {
    /**
     * If no solver id is provided, the toolbox choose the solver itself via meta solver strategy
     */
    requestedSolverId?: string,
    /**
     * Map from problem type to SubSolveRequest to allow explicitly requested solvers for a subroutine
     */
    requestedSubSolveRequests: Map<string, SolverChoice>
}

export interface SolveRequest<T> extends SolverChoice {
    requestContent?: T;
    /**
     * If no solver id is provided, the toolbox choose the solver itself via meta solver strategy
     */
}
