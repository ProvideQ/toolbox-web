export interface SolveRequest {
    requestContent?: any;
    /**
     * If no solver id is provided, the toolbox choose the solver itself via meta solver strategy
     */
    requestedSolverId?: string,
    requestedSubSolveRequests: Map<string, SolveRequest>
}
