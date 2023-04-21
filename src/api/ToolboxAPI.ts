import { SubRoutineDefinition } from "../components/solvers/SubRoutineDefinition";
import { ProblemSolver } from "../components/solvers/ProblemSolver";
import { Solution } from "../components/solvers/Solution";
import { SolutionStatus } from "../components/solvers/SolutionStatus";
import { SolveRequest } from "../components/solvers/SolveRequest";

export async function postProblem(problemUrl: string, solveRequest: SolveRequest): Promise<Solution> {
    return fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/solve/${problemUrl}`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solveRequest)
        })
        .then(response => response.json())
        .then(json => json as Solution)
        .catch(reason => {
            return {
                id: -1,
                status: SolutionStatus.INVALID,
                solverName: "",
                executionMilliseconds: 0,
                solutionData: "",
                debugData: "",
                metaData: "",
                error: `${reason}`,
            }
        });
}

export async function fetchSolvers(problemUrl: string): Promise<ProblemSolver[]> {
    return fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/solvers/${problemUrl}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(json => json as ProblemSolver[])
        .catch(reason => {
            console.error(reason)
            alert(`Could not retrieve solvers of type ${problemUrl}.`)
            return []
        });
}

export async function fetchSubRoutines(problemUrl: string, solverId: string): Promise<SubRoutineDefinition[]> {
    return fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sub-routines/${problemUrl}?${new URLSearchParams({ id: solverId })}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .catch(reason => {
            console.error(reason)
            alert(`Could not retrieve subroutines of solver ${solverId}.`)
            return []
        });
}
