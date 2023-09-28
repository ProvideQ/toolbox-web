import { MetaSolverSetting } from "./data-model/MetaSolverSettings";
import { SubRoutineDefinition } from "./data-model/SubRoutineDefinition";
import { ProblemSolver } from "./data-model/ProblemSolver";
import { Solution } from "./data-model/Solution";
import { SolutionStatus } from "./data-model/SolutionStatus";
import { SolveRequest } from "./data-model/SolveRequest";

/**
 * Getter for the base url of the toolbox API.
 */
export const baseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL;

export async function postProblem<T>(
  problemType: string,
  solveRequest: SolveRequest<T>
): Promise<Solution> {
  return fetch(`${baseUrl()}/solve/${problemType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(solveRequest),
  })
    .then((response) => response.json())
    .then((json) => json as Solution)
    .catch((reason) => {
      return {
        id: -1,
        status: SolutionStatus.INVALID,
        solverName: "",
        executionMilliseconds: 0,
        solutionData: "",
        debugData: "",
        metaData: "",
        error: `${reason}`,
      };
    });
}

export async function fetchSolvers(
  problemType: string
): Promise<ProblemSolver[]> {
  return fetch(`${baseUrl()}/solvers/${problemType}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => json as ProblemSolver[])
    .catch((reason) => {
      console.error(reason);
      alert(`Could not retrieve solvers of type ${problemType}.`);
      return [];
    });
}

export async function fetchSubRoutines(
  problemType: string,
  solverId: string
): Promise<SubRoutineDefinition[]> {
  return fetch(
    `${baseUrl()}/sub-routines/${problemType}?${new URLSearchParams({
      id: solverId,
    })}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .catch((reason) => {
      console.error(reason);
      alert(`Could not retrieve subroutines of solver ${solverId}.`);
      return [];
    });
}

export async function fetchMetaSolverSettings(
  problemType: string
): Promise<MetaSolverSetting[]> {
  return fetch(`${baseUrl()}/meta-solver/settings/${problemType}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((reason) => {
      console.log(reason);
      return [];
    });
}
