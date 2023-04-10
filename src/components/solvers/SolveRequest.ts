export interface SolveRequest {
    requestContent?: any;
    requestedSolverId?: string,
    requestedSubSolveRequests: SolveMap
}

export type SolveMap = {
    [key: string]: SolveRequest
}