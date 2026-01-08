import { getInvalidProblemDto, ProblemDto } from "./data-model/ProblemDto";
import { ProblemSolverInfo } from "./data-model/ProblemSolverInfo";
import { ProblemState } from "./data-model/ProblemState";
import { ProblemTypeDto } from "./data-model/ProblemTypeDto";
import { SolverSetting } from "./data-model/SolverSettings";
import { SubRoutineDefinitionDto } from "./data-model/SubRoutineDefinitionDto";

export class ToolboxApi {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getProblemTypes(): Promise<ProblemTypeDto[]> {
    return fetch(`${this.baseUrl}/problem-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => json as ProblemTypeDto[])
      .catch((error) => {
        console.error(
          "Could not retrieve problem types " + this.baseUrl + "/problem-types",
          error
        );
        return [];
      });
  }

  async fetchSolvers(problemTypeId: string) {
    return fetch(`${this.baseUrl}/solvers/${problemTypeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => response.json())
      .then((json) => json as ProblemSolverInfo[])
      .catch((error) => {
        console.error(
          `Could not retrieve solvers of type ${problemTypeId}`,
          error
        );
        return [];
      });
  }

  async fetchSubRoutines(
    problemTypeId: string,
    solverId: string
  ): Promise<SubRoutineDefinitionDto[]> {
    return fetch(
      `${this.baseUrl}/solvers/${problemTypeId}/${solverId}/sub-routines`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => json as SubRoutineDefinitionDto[])
      .catch((error) => {
        console.error(
          `Could not retrieve subroutines of solver ${solverId}`,
          error
        );
        return [];
      });
  }

  async fetchSolverSettings(
    problemTypeId: string,
    solverId: string
  ): Promise<SolverSetting[]> {
    return fetch(
      `${this.baseUrl}/solvers/${problemTypeId}/${solverId}/settings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => json as SolverSetting[])
      .catch((error) => {
        console.error(
          `Could not retrieve subroutines of solver ${solverId}`,
          error
        );
        return [];
      });
  }

  async getSolver(problemTypeId: string, solverId: string) {
    const solvers = await this.fetchSolvers(problemTypeId);
    return solvers.find((s) => s.id === solverId);
  }

  async fetchProblem<T>(
    problemTypeId: string,
    problemId: string
  ): Promise<ProblemDto<T>> {
    return fetch(`${this.baseUrl}/problems/${problemTypeId}/${problemId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json as ProblemDto<T>;
        if (data.solverId === null) {
          data.solverId = undefined;
        }
        return data;
      })
      .catch((error) => {
        return {
          ...getInvalidProblemDto(),
          error: `${error}`,
        };
      });
  }

  async postProblem<T>(
    problemTypeId: string,
    problemRequest: ProblemDto<T>
  ): Promise<ProblemDto<T>> {
    return fetch(`${this.baseUrl}/problems/${problemTypeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(problemRequest),
    })
      .then((response) => response.json())
      .then((json) => json as ProblemDto<T>)
      .catch((error) => {
        return {
          ...problemRequest,
          error: `${error}`,
        };
      });
  }

  async patchProblem<T>(
    problemTypeId: string,
    problemId: string,
    updateParameters: {
      input?: any;
      solverId?: string;
      state?: ProblemState;
      solverSettings?: SolverSetting[];
    }
  ): Promise<ProblemDto<T>> {
    return fetch(`${this.baseUrl}/problems/${problemTypeId}/${problemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateParameters),
    })
      .then((response) => response.json())
      .then((json) => json as ProblemDto<T>)
      .catch((error) => {
        return {
          ...getInvalidProblemDto(),
          error: `${error}`,
        };
      });
  }

  async fetchProblemAttribute(
    problemTypeId: string,
    problemId: string,
    attributeName: string
  ): Promise<any> {
    return fetch(
      `${this.baseUrl}/problems/${problemTypeId}/${problemId}/attributes/${attributeName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        console.error(
          `Could not retrieve attribute ${attributeName} of problem ${problemId}`,
          error
        );
        return undefined;
      });
  }

  async fetchExampleProblems(problemTypeId: string) {
    return fetch(`${baseUrl()}/problems/${problemTypeId}/examples`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  }
}

/**
 * Getter for the base url of the toolbox API.
 */
export const baseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL;

export const toolboxApi = new ToolboxApi(baseUrl() || "");
