import { Auth0FgaRequiredParamError } from "./errors";

/**
 *
 * @throws {Auth0FgaRequiredParamError}
 * @export
 */
export const assertParamExists = function (functionName: string, paramName: string, paramValue: unknown) {
  if (paramValue === null || paramValue === undefined) {
    throw new Auth0FgaRequiredParamError(functionName, paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
  }
};
