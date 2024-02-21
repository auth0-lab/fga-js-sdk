/**
 * JavaScript and Node.js SDK for Auth0 Fine Grained Authorization (FGA)
 *
 * API version: 0.1
 * Website: <https://fga.dev>
 * Documentation: <https://docs.fga.dev>
 * Support: <https://discord.gg/8naAwJfWN6>
 * License: [MIT](https://github.com/auth0-lab/fga-js-sdk/blob/main/LICENSE)
 *
 */

import {
  Configuration as OpenFgaConfiguration,
  UserConfigurationParams as OpenFgaConfigurationParams,
  CredentialsMethod,
} from "@openfga/sdk";

import { FgaInvalidEnvironmentError } from "./errors";

import { assertParamExists } from "./validation";
import { FgaEnvironment } from "./constants";

export type UserConfigurationParams = Pick<OpenFgaConfiguration, "storeId" | "baseOptions" | "retryParams"> & {
  clientId: string;
  clientSecret: string;
  environment?: string;
};

export type UserClientConfigurationParams = UserConfigurationParams & {
  authorizationModelId?: string;
};

export interface EnvironmentConfiguration {
  apiScheme: string;
  apiHost: string;
  apiTokenIssuer: string;
  apiAudience: string;
  allowNoAuth?: boolean;
}

export class Configuration extends OpenFgaConfiguration {
  /**
   * Defines the version of the SDK
   *
   * @private
   * @type {string}
   * @memberof Configuration
   */
  private static auth0SdkVersion = "0.9.1";

  /**
   * Client ID
   *
   * @type {string}
   * @memberof Configuration
   */
  private clientId?: string;
  /**
   * Client Secret
   *
   * @type {string}
   * @memberof Configuration
   */
  private clientSecret?: string;
  /**
   * API Token Issuer
   *
   * @type {string}
   * @memberof Configuration
   */
  private apiTokenIssuer?: string;
  /**
   * API Audience
   *
   * @type {string}
   * @memberof Configuration
   */
  private apiAudience?: string;

  constructor(params: UserConfigurationParams = {} as unknown as UserConfigurationParams) {
    super(Configuration.validateAndCastToOpenFgaParams(params));
  }

  /**
   *
   * @throws {FgaInvalidEnvironmentError}
   * @param environment - Environment from user config
   * @return EnvironmentConfiguration
   */
  public static getEnvironmentConfiguration = (environment: string = "default"): EnvironmentConfiguration => {
    switch (environment) {
      case "default":
      case "us":
      case FgaEnvironment.US1:
        return {
          apiAudience: "https://api.us1.fga.dev/",
          apiTokenIssuer: "fga.us.auth0.com",
          apiScheme: "https",
          apiHost: "api.us1.fga.dev",
        };
      case FgaEnvironment.Playground:
        return {
          apiAudience: "https://api.playground.fga.dev/",
          apiTokenIssuer: "sandcastle-dev.us.auth0.com",
          apiScheme: "https",
          apiHost: "api.playground.fga.dev",
          allowNoAuth: true,
        };
      case FgaEnvironment.Staging:
        return {
          apiAudience: "https://api.staging.fga.dev/",
          apiTokenIssuer: "sandcastle-dev.us.auth0.com",
          apiScheme: "https",
          apiHost: "api.staging.fga.dev",
        };
      default:
        throw new FgaInvalidEnvironmentError(environment, ["us1", "playground"]);
    }
  };

  private static validateAndCastToOpenFgaParams(params: UserConfigurationParams): OpenFgaConfigurationParams {
    const openFgaConfig: Partial<ClientConfiguration> = {};

    assertParamExists("Configuration", "storeId", params.storeId);

    const environmentConfiguration = Configuration.getEnvironmentConfiguration(params.environment);

    if (!environmentConfiguration.allowNoAuth) {
      assertParamExists("Configuration", "clientId", params.clientId);
      assertParamExists("Configuration", "clientSecret", params.clientSecret);
    }

    openFgaConfig.apiScheme = environmentConfiguration.apiScheme;
    openFgaConfig.apiHost = environmentConfiguration.apiHost!;
    openFgaConfig.storeId = params.storeId!;

    if (params.clientId || params.clientSecret) {
      openFgaConfig.credentials = {
        method: CredentialsMethod.ClientCredentials,
        config: {
          clientId: params.clientId,
          clientSecret: params.clientSecret,
          apiTokenIssuer: environmentConfiguration.apiTokenIssuer,
          apiAudience: environmentConfiguration.apiAudience,
        },
      };
    }

    const baseOptions: Partial<UserConfigurationParams["baseOptions"]> = params.baseOptions || {};
    baseOptions.headers = baseOptions.headers || {};

    if (typeof process === "object" && process.title === "node" && !baseOptions.headers["User-Agent"]) {
      baseOptions.headers["User-Agent"] = "auth0-fga-sdk {sdkId}/{packageVersion}"
        .replace("{sdkId}", "js")
        .replace("{packageVersion}", this.auth0SdkVersion);
    }

    openFgaConfig.baseOptions = baseOptions as UserConfigurationParams["baseOptions"];
    openFgaConfig.retryParams = params.retryParams;

    return openFgaConfig as OpenFgaConfigurationParams;
  }
}

export class ClientConfiguration extends Configuration {
  /**
   * Authorization Model ID
   *
   * @type {string}
   * @memberof Configuration
   */
  public authorizationModelId?: string;
}
