import {Solution} from "../components/solvers/Solution";

export async function postProblem(problemType: string, content: any): Promise<Solution> {
    let returnData: Solution = { debugData: "", error: "", metaData: "", solutionData: "" };

    await fetch(`${process.env.API_BASE_URL}/solve/${problemType}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requestContent: content
        })
    }).then(async (res) => {
        returnData = await res.json() as Solution;
    }).catch(reason => {
        returnData = {
            solutionData: "",
            debugData: "",
            metaData: "",
            error: reason
        }
    });

    return returnData;
}