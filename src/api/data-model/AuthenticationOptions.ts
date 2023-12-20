export interface AuthenticationOptions {
  /**
   * Name of the authentication agent
   */
  authenticationAgent: string;
  /**
   * Additional information about the authentication procedure
   */
  authenticationDescription: string;
  /**
   * Supports token flag
   */
  supportsToken: boolean;
}
