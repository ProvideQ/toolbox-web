import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { ProblemSolverInfo } from "../../../api/toolbox/data-model/ProblemSolverInfo";
import { toolboxApi } from "../../../api/toolbox/ToolboxAPI";

interface SolversMap {
  [key: string]: ProblemSolverInfo[];
}

// This is a React context that globally gives access to the solvers that are available for a given problem type
// Using the useSolvers() context hook in a component will give you access to the solvers and a function
// to fetch them for the first time - they will be cached in the context for future use
const SolverContext = createContext<{
  solvers: SolversMap;
  getSolvers: (problemTypeId: string) => Promise<ProblemSolverInfo[]>;
}>({
  solvers: {},
  getSolvers: () => Promise.resolve([]),
});

export const useSolvers = () => useContext(SolverContext);

export const SolverProvider = (props: { children: ReactNode }) => {
  const [solvers, setSolvers] = useState<SolversMap>({});

  const value = useMemo(
    () => ({
      solvers,
      getSolvers: async (problemTypeId: string) => {
        // Function to get solvers, either from cache or by fetching
        const cachedSolvers = solvers[problemTypeId];
        if (cachedSolvers) {
          return cachedSolvers;
        } else {
          const fetchedSolvers = await toolboxApi.fetchSolvers(problemTypeId);
          setSolvers((prevSolvers) => ({
            ...prevSolvers,
            [problemTypeId]: fetchedSolvers,
          }));
          return fetchedSolvers;
        }
      },
    }),
    [solvers],
  );

  return (
    <SolverContext.Provider value={value}>
      {props.children}
    </SolverContext.Provider>
  );
};
