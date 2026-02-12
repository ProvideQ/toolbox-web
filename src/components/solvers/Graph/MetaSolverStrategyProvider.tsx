import { createContext, ReactNode, useContext, useState } from "react";
import { MetaSolverStrategyDto } from "../../../api/strategy/data-model/MetaSolverStrategyDto";
import { strategyApi } from "../../../api/strategy/StrategyAPI";

interface StrategiesMap {
  [key: string]: MetaSolverStrategyDto[];
}

// This is a React context that globally gives access to the solvers that are available for a given problem type
// Using the useMetaSolverStrategies() context hook in a component will give you access to the solvers and a function
// to fetch them for the first time - they will be cached in the context for future use
const StrategyContext = createContext<{
  strategies: StrategiesMap;
  getStrategies: (problemTypeId: string) => Promise<MetaSolverStrategyDto[]>;
}>({
  strategies: {},
  getStrategies: () => Promise.resolve([]),
});

export const useMetaSolverStrategies = () => useContext(StrategyContext);

export const StrategyProvider = (props: { children: ReactNode }) => {
  const [strategies, setStrategies] = useState<StrategiesMap>({});

  // Function to get solvers, either from cache or by fetching
  const getStrategies = async (problemTypeId: string) => {
    const cachedSolvers = strategies[problemTypeId];
    if (cachedSolvers) {
      return cachedSolvers;
    } else {
      const strategies = await strategyApi.listStrategies(problemTypeId);
      setStrategies((previous) => ({
        ...previous,
        [problemTypeId]: strategies,
      }));
      return strategies;
    }
  };

  return (
    <StrategyContext.Provider value={{ strategies, getStrategies }}>
      {props.children}
    </StrategyContext.Provider>
  );
};
