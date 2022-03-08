import { AxiosError, Method } from "axios";
import {
  AuthErrorCode,
  ErrorCode,
  InternalErrorCode,
  NotFoundErrorCode,
  ResourceExhaustedErrorCode,
} from "./apiModel";

/**
 *
 * @export
 * @class Auth0FgaError
 * @extends {Error}
 */
export class Auth0FgaError extends Error {
  name = "Auth0FgaError";

  constructor(err?: Error | string | unknown, msg?: string) {
    super(
      msg || typeof err === "string"
        ? (err as string)
        : `Auth0 FGA Error${(err as Error)?.message ? `: ${(err as Error).message}` : ""}`
    );
    if ((err as Error)?.stack) {
      this.stack = (err as Error).stack;
    }
  }
}

function getRequestMetadataFromPath(path?: string): {
  storeId: string;
  endpointCategory: string;
} {
  // This function works because all paths start with /stores/{storeId}/{type}

  let splitPath: string[] = (path || "").split("/");
  if (splitPath.length < 4) {
    splitPath = [];
  }
  const storeId = splitPath[2] || "";
  const endpointCategory = splitPath[3] || "";

  return { storeId, endpointCategory };
}

const cFGARequestId = "fga-request-id";

function getResponseHeaders(err: AxiosError): any {
  return err.response
    ? Object.fromEntries(
      Object.entries(err.response.headers).map(([k, v]) => [
        k.toLowerCase(), v,
      ])
    )
    : {};
}

/**
 *
 * @export
 * @class Auth0FgaApiError
 * @extends {Auth0FgaError}
 */
export class Auth0FgaApiError extends Auth0FgaError {
  name = "Auth0FgaApiError";
  public statusCode?: number;
  public statusText?: string;
  public method?: Method;
  public requestURL?: string;
  public storeId?: string;
  public endpointCategory?: string;
  public apiErrorMessage?: string;
  public requestData?: any;
  public responseData?: any;
  public responseHeader?: Record<string, string>;
  public requestId?: string;

  constructor(err: AxiosError, msg?: string) {
    super(msg ? msg : err);
    this.statusCode = err.response?.status;
    this.statusText = err.response?.statusText;
    this.requestData = err.config?.data;
    this.requestURL = err.config?.url;
    this.method = err.config?.method;
    const { storeId, endpointCategory } = getRequestMetadataFromPath(
      err.request?.path
    );
    this.storeId = storeId;
    this.endpointCategory = endpointCategory;
    this.apiErrorMessage = err.response?.data?.message;
    this.responseData = err.response?.data;
    this.responseHeader = err.response?.headers;
    const errResponseHeaders = getResponseHeaders(err);
    this.requestId = errResponseHeaders[cFGARequestId];

    if ((err as Error)?.stack) {
      this.stack = (err as Error).stack;
    }
  }
}

/**
 *
 * @export
 * @class Auth0FgaApiValidationError
 * @extends {Auth0FgaApiError}
 */
export class Auth0FgaApiValidationError extends Auth0FgaApiError {
  name = "Auth0FgaApiValidationError";
  public apiErrorCode: ErrorCode;
  constructor(err: AxiosError, msg?: string) {
    // If there is a better error message, use it instead of the default error
    super(err);
    this.apiErrorCode = err.response?.data?.code;
    const { endpointCategory } = getRequestMetadataFromPath(err.request?.path);
    this.message = msg
      ? msg
      : err.response?.data?.message
        ? `Auth0 FGA Validation Error: ${err.config?.method} ${endpointCategory} : Error ${err.response?.data?.message}`
        : (err as Error).message;
  }
}

/**
 *
 * @export
 * @class Auth0FgaApiNotFoundError
 * @extends {Auth0FgaApiError}
 */
export class Auth0FgaApiNotFoundError extends Auth0FgaApiError {
  name = "Auth0FgaApiNotFoundError";
  public apiErrorCode: NotFoundErrorCode;
  constructor(err: AxiosError, msg?: string) {
    // If there is a better error message, use it instead of the default error
    super(err);
    this.apiErrorCode = err.response?.data?.code;
    this.message = msg
      ? msg
      : err.response?.data?.message
        ? `Auth0 FGA NotFound Error: ${err.config?.method} : Error ${err.response?.data?.message}`
        : (err as Error).message;
  }
}

function getMaximumRateUnit(api: string): string {
  switch (api) {
  case "check":
  case "read":
  case "write":
    return "second";
  default:
    return "minute";
  }
}

const cXRateLimit = "x-ratelimit-limit";
const cXRateLimitReset = "x-ratelimit-reset";
/**
 *
 * @export
 * @class Auth0FgaApiRateLimitExceededError
 * @extends {Auth0FgaApiError}
 */
export class Auth0FgaApiRateLimitExceededError extends Auth0FgaApiError {
  name = "Auth0FgaApiRateLimitExceededError";
  public apiErrorCode: ResourceExhaustedErrorCode;

  rateLimit?: number;
  rateUnit?: string;
  rateLimitResetEpoch?: number;

  constructor(err: AxiosError, msg?: string) {
    super(err);
    this.apiErrorCode = err.response?.data?.code;

    const { endpointCategory } = getRequestMetadataFromPath(err.request?.path);
    const errResponseHeaders = getResponseHeaders(err);
    this.rateLimit = Number(errResponseHeaders[cXRateLimit]);
    this.rateUnit = getMaximumRateUnit(endpointCategory);
    this.rateLimitResetEpoch = Number(errResponseHeaders[cXRateLimitReset]);
    this.message = msg
      ? msg
      : `Auth0 FGA Rate Limit Error for ${this.method} ${endpointCategory} with API limit of ${this.rateLimit} requests per ${this.rateUnit}.`;
  }
}

/**
 *
 * @export
 * @class Auth0FgaApiInternalError
 * @extends {Auth0FgaApiError}
 */
export class Auth0FgaApiInternalError extends Auth0FgaApiError {
  name = "Auth0FgaApiInternalError";
  public apiErrorCode: InternalErrorCode;

  constructor(err: AxiosError, msg?: string) {
    // If there is a better error message, use it instead of the default error
    super(err);
    const { endpointCategory } = getRequestMetadataFromPath(err.request?.path);
    this.apiErrorCode = err.response?.data?.code;

    this.message = msg
      ? msg
      : err.response?.data?.message
        ? `Auth0 FGA Internal Error: ${err.config?.method} ${endpointCategory} : Error ${err.response?.data?.message}`
        : (err as Error).message;
  }
}

/**
 *
 * @export
 * @class Auth0FgaAuthenticationError
 * @extends {Auth0FgaApiError}
 */
export class Auth0FgaAuthenticationError extends Auth0FgaError {
  name = "Auth0FgaApiAuthenticationError";
  public statusCode?: number;
  public statusText?: string;
  public method?: Method;
  public requestURL?: string;
  public clientId?: string;
  public audience?: string;
  public grantType?: string;
  public responseData?: any;
  public responseHeader?: any;
  public requestId?: string;
  public apiErrorCode: AuthErrorCode;

  constructor(err: AxiosError) {
    super(`Auth0 FGA Authentication Error.  ${err.response?.statusText}`);
    this.statusCode = err.response?.status;
    this.statusText = err.response?.statusText;
    this.requestURL = err.config?.url;
    this.method = err.config?.method;
    this.responseData = err.response?.data;
    this.responseHeader = err.response?.headers;
    this.apiErrorCode = err.response?.data?.code;

    const errResponseHeaders = getResponseHeaders(err);
    this.requestId = errResponseHeaders[cFGARequestId];

    let data: any;
    try {
      data = JSON.parse(err.config?.data || "{}");
    } catch (err) {
      /* do nothing */
    }
    this.clientId = data?.client_id;
    this.audience = data?.audience;
    this.grantType = data?.grant_type;
    if ((err as Error)?.stack) {
      this.stack = (err as Error).stack;
    }
  }
}

/**
 *
 * @export
 * @class Auth0FgaValidationError
 * @extends {Auth0FgaError}
 */
export class Auth0FgaValidationError extends Auth0FgaError {
  name = "Auth0FgaValidationError";
  constructor(public field: string, msg?: string) {
    super(msg);
  }
}

/**
 *
 * @export
 * @class Auth0FgaRequiredParamError
 * @extends {Auth0FgaValidationError}
 */
export class Auth0FgaRequiredParamError extends Auth0FgaValidationError {
  name = "Auth0FgaRequiredParamError";
  constructor(public functionName: string, field: string, msg?: string) {
    super(field, msg);
  }
}

/**
 *
 * @export
 * @class Auth0FgaInvalidEnvironmentError
 * @extends {Auth0FgaValidationError}
 */
export class Auth0FgaInvalidEnvironmentError extends Auth0FgaValidationError {
  name = "InvalidEnvironmentError";
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
