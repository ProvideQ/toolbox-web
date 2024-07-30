import { getInvalidProblemDto, ProblemDto } from "./data-model/ProblemDto";
import { ProblemSolverInfo } from "./data-model/ProblemSolverInfo";
import { ProblemState } from "./data-model/ProblemState";
import { SubRoutineDefinitionDto } from "./data-model/SubRoutineDefinitionDto";

/**
 * Getter for the base url of the toolbox API.
 */
export const baseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchProblem<T>(
  problemTypeId: string,
  problemId: string
): Promise<ProblemDto<T>> {
  return fetch(`${baseUrl()}/problems/${problemTypeId}/${problemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const data = json as ProblemDto<T>;

      // Explicitly set solverId to undefined if it is null
      if (data.solverId === null) {
        data.solverId = undefined;
      }

      return data;
    })
    .catch((reason) => {
      return {
        ...getInvalidProblemDto(),
        error: `${reason}`,
      };
    });
}

export async function postProblem<T>(
  problemTypeId: string,
  problemRequest: ProblemDto<T>
): Promise<ProblemDto<T>> {
  return fetch(`${baseUrl()}/problems/${problemTypeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(problemRequest),
  })
    .then((response) => response.json())
    .then((json) => json as ProblemDto<T>)
    .catch((reason) => {
      return {
        ...problemRequest,
        error: `${reason}`,
      };
    });
}

export async function patchProblem<T>(
  problemTypeId: string,
  problemId: string,
  updateParameters: { input?: any; solverId?: string; state?: ProblemState }
): Promise<ProblemDto<T>> {
  let url = `${baseUrl()}/problems/${problemTypeId}/${problemId}`;
  console.log(url);
  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateParameters),
  })
    .then((response) => response.json())
    .then((json) => json as ProblemDto<T>)
    .catch((reason) => {
      return {
        ...getInvalidProblemDto(),
        error: `${reason}`,
      };
    });
}

export async function fetchSolvers(
  problemTypeId: string
): Promise<ProblemSolverInfo[]> {
  return fetch(`${baseUrl()}/solvers/${problemTypeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => response.json())
    .then((json) => json as ProblemSolverInfo[])
    .catch((reason) => {
      console.error(reason);
      alert(`Could not retrieve solvers of type ${problemTypeId}.`);
      return [];
    });
}

export async function fetchSubRoutines(
  problemTypeId: string,
  solverId: string
): Promise<SubRoutineDefinitionDto[]> {
  return fetch(
    `${baseUrl()}/sub-routines/${problemTypeId}?${new URLSearchParams({
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

// export async function fetchMetaSolverSettings(
//   problemTypeId: string
// ): Promise<MetaSolverSetting[]> {
//   return fetch(`${baseUrl()}/meta-solver/settings/${problemTypeId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .catch((reason) => {
//       console.log(reason);
//       return [];
//     });
// }
