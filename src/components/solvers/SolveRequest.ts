export interface SubSolveRequest {
    /**
     * If no solver id is provided, the toolbox choose the solver itself via meta solver strategy
     */
    requestedSolverId?: string,
    /**
     * Map from problem type to SubSolveRequest to allow explicitly requested solvers for a subroutine
     */
    requestedSubSolveRequests: Map<string, SubSolveRequest>
}

export interface SolveRequest<T> extends SubSolveRequest {
    requestContent?: T;
    /**
     * If no solver id is provided, the toolbox choose the solver itself via meta solver strategy
     */
}
