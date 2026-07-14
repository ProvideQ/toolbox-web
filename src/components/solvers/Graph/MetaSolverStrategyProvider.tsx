import { createContext, ReactNode, useContext, useMemo, useState } from "react";
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

export const StrategyProvider = (props: {
  children: ReactNode;
  isMssApiAvailable: boolean;
}) => {
  const [strategies, setStrategies] = useState<StrategiesMap>({});

  const value = useMemo(
    () => ({
      strategies,
      getStrategies: async (problemTypeId: string) => {
        // Function to get solvers, either from cache or by fetching
        if (!props.isMssApiAvailable) return [];

        const cachedSolvers = strategies[problemTypeId];
        if (cachedSolvers) return cachedSolvers;

        try {
          const strategies = await strategyApi.listStrategies(problemTypeId);
          setStrategies((previous) => ({
            ...previous,
            [problemTypeId]: strategies,
          }));
          return strategies;
        } catch (error) {
          console.error(
            `Failed to fetch strategies for problem type ${problemTypeId}`,
            error,
          );
          return [];
        }
      },
    }),
    [props.isMssApiAvailable, strategies],
  );

  return (
    <StrategyContext.Provider value={value}>
      {props.children}
    </StrategyContext.Provider>
  );
};
