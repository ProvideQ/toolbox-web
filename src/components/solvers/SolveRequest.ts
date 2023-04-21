export interface SolveRequest {
    requestContent?: any;
    requestedSolverId?: string,
    requestedSubSolveRequests: Map<string, SolveRequest>
}
