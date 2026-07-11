import { createContext, ReactNode, useState } from "react";
import { ProblemDto } from "../../../../api/toolbox/data-model/ProblemDto";

interface Props {
  children: ReactNode;
}

type NodeDetailsContextType = {
  problemDtos: ProblemDto<any>[];
  selectProblemDtos: (problemDtos: ProblemDto<any>[]) => void;
};

export const NodeDetailsContext = createContext<NodeDetailsContextType>({
  problemDtos: [],
  selectProblemDtos: () => {},
});

export function NodeDetailsProvider({ children }: Props) {
  const [problemDtos, setProblemDtos] = useState<ProblemDto<any>[]>([]);

  function selectProblemDtos(problemDtos: ProblemDto<any>[]) {
    setProblemDtos(problemDtos);
  }

  console.log('problemDtos', problemDtos);

  return (
    <NodeDetailsContext.Provider value={{ problemDtos, selectProblemDtos }}>
      {children}
    </NodeDetailsContext.Provider>
  );
}
