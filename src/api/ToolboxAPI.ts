import {Solution} from "../components/solvers/Solution";
import {ProblemSolver} from "../components/solvers/ProblemSolver";

export async function postProblem(problemType: string, content: any, solver: ProblemSolver | undefined): Promise<Solution> {
    let returnData: Solution = { debugData: "", error: "", metaData: "", solutionData: "" };

    await fetch(`${process.env.API_BASE_URL}/solve/${problemType}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requestContent: content,
            requestedSolverId: solver?.id
        })
    }).then(async (res) => {
        returnData = await res.json() as Solution;
    }).catch(reason => {
        returnData = {
            solutionData: "",
            debugData: "",
            metaData: "",
            error: `${reason}`,
        }
    });

    return returnData;
}

export async function fetchSolvers(problemType: string): Promise<ProblemSolver[]> {
    let result: ProblemSolver[] = [];

    await fetch(`${process.env.API_BASE_URL}/solvers/${problemType}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(async (res) => {
        result = await res.json() as ProblemSolver[];
    }).catch(reason => {
        console.log(reason)
    });

    return result;
}