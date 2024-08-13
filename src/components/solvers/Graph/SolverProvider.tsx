import { createContext, ReactNode, useContext, useState } from "react";
import { ProblemSolverInfo } from "../../../api/data-model/ProblemSolverInfo";
import { fetchSolvers } from "../../../api/ToolboxAPI";

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
  getSolvers: (x) => Promise.resolve([]),
});

export const useSolvers = () => useContext(SolverContext);

export const SolverProvider = (props: { children: ReactNode }) => {
  const [solvers, setSolvers] = useState<SolversMap>({});

  // Function to get solvers, either from cache or by fetching
  const getSolvers = async (problemTypeId: string) => {
    const cachedSolvers = solvers[problemTypeId];
    if (cachedSolvers) {
      return cachedSolvers;
    } else {
      const fetchedSolvers = await fetchSolvers(problemTypeId);
      setSolvers((prevSolvers) => ({
        ...prevSolvers,
        [problemTypeId]: fetchedSolvers,
      }));
      return fetchedSolvers;
    }
  };

  return (
    <SolverContext.Provider value={{ solvers, getSolvers }}>
      {props.children}
    </SolverContext.Provider>
  );
};
