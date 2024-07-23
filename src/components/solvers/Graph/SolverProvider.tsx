import { createContext, ReactNode, useContext, useState } from "react";
import { ProblemSolverInfo } from "../../../api/data-model/ProblemSolverInfo";
import { fetchSolvers } from "../../../api/ToolboxAPI";

interface SolversMap {
  [key: string]: ProblemSolverInfo[];
}

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
  const getSolvers = async (problemType: string) => {
    const cachedSolvers = solvers[problemType];
    if (cachedSolvers) {
      return cachedSolvers;
    } else {
      const fetchedSolvers = await fetchSolvers(problemType);
      setSolvers((prevSolvers) => ({
        ...prevSolvers,
        [problemType]: fetchedSolvers,
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
