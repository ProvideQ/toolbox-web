import { AuthenticationOptions } from "./AuthenticationOptions";

export interface ProblemSolver {
  id: string;
  name: string;
  authenticationOptions?: AuthenticationOptions;
}
