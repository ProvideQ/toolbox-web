import { MetaSolverStrategyDto } from "./data-model/MetaSolverStrategyDto";
import { MetaSolverStrategyExecutionOutput } from "./data-model/MetaSolverStrategyExecutionOutput";

export class StrategyApi {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async listStrategies(
    problemTypeId: string = "",
  ): Promise<MetaSolverStrategyDto[]> {
    const query = problemTypeId ? "?type=" + problemTypeId : "";

    return await fetch(`${this.baseUrl}/strategies` + query)
      .then((res) => res.json())
      .then((json) => json as MetaSolverStrategyDto[])
      .catch((error) => {
        console.error("Failed to list strategies", error);
        return [];
      });
  }

  listAllStrategies(): Promise<MetaSolverStrategyDto[]> {
    return fetch(`${this.baseUrl}/strategies`)
      .then((res) => res.json())
      .then((json) => json as MetaSolverStrategyDto[])
      .catch((error) => {
        console.error("Failed to list all strategies", error);
        throw error;
      });
  }

  getStrategy(strategyId: string): Promise<MetaSolverStrategyDto> {
    return fetch(`${this.baseUrl}/strategies/${strategyId}`)
      .then((res) => res.json())
      .then((json) => json as MetaSolverStrategyDto)
      .catch((error) => {
        console.error(`Failed to get strategy ${strategyId}`, error);
        throw error;
      });
  }

  createStrategy(payload: {
    name: string;
    code: string;
  }): Promise<MetaSolverStrategyDto> {
    return fetch(`${this.baseUrl}/strategies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => json as MetaSolverStrategyDto)
      .catch((error) => {
        console.error("Failed to create strategy", error);
        throw error;
      });
  }

  updateStrategy(
    strategyId: string,
    payload: { name: string; code: string },
  ): Promise<MetaSolverStrategyDto> {
    return fetch(`${this.baseUrl}/strategies/${strategyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => json as MetaSolverStrategyDto)
      .catch((error) => {
        console.error(`Failed to update strategy ${strategyId}`, error);
        throw error;
      });
  }

  deleteStrategy(strategyId: string): Promise<void> {
    return fetch(`${this.baseUrl}/strategies/${strategyId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => undefined)
      .catch((error) => {
        console.error(`Failed to delete strategy ${strategyId}`, error);
        throw error;
      });
  }

  executeStrategy(
    strategyId: string,
    problemId: string,
  ): Promise<MetaSolverStrategyExecutionOutput> {
    return fetch(`${this.baseUrl}/strategies/${strategyId}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: problemId }),
    })
      .then((res) => res.json())
      .then((json) => json as MetaSolverStrategyExecutionOutput)
      .catch((error) => {
        console.error(
          `Failed to execute strategy ${strategyId} on problem ${problemId}`,
          error,
        );
        throw error;
      });
  }
}

export const baseUrl = () => process.env.NEXT_PUBLIC_MSS_API_BASE_URL;

export const strategyApi = new StrategyApi(baseUrl() || "");

console.log(baseUrl());
