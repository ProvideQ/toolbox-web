import {Solution} from "../components/solvers/Solution";
import {ProblemSolver} from "../components/solvers/ProblemSolver";

export async function postProblem(problemType: string, content: any, solver: ProblemSolver | undefined): Promise<Solution> {
    return fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/solve/${problemType}`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requestContent: content,
                requestedSolverId: solver?.id
            })
        })
        .then(response => response.json())
        .then(json => json as Solution)
        .catch(reason => {
            return {
                solutionData: "",
                debugData: "",
                metaData: "",
                error: `${reason}`,
            }
        });
}

export async function fetchSolvers(problemType: string): Promise<ProblemSolver[]> {
    return fetch(
        `${process.env.API_BASE_URL}/solvers/${problemType}`,
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
            alert(`Could not retrieve solvers of type ${problemType}.`)
            return []
        });
}