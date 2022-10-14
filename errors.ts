import { FgaValidationError } from "@openfga/sdk";

/**
 *
 * @export
 * @class FgaInvalidEnvironmentError
 * @extends { FgaValidationError }
 */
export class FgaInvalidEnvironmentError extends FgaValidationError {
  name = "FgaInvalidEnvironmentError";
  constructor(field: string, allowedEnvironments?: string[]) {
    super(
      field,
      allowedEnvironments
        ? `environment is required and must be one of the following: ${allowedEnvironments.join(
          ", "
        )}`
        : undefined
    );
  }
}
