/* tslint:disable */
/* eslint-disable */
/**
 * JavaScript and Node.js SDK for Auth0 Fine Grained Authorization (FGA)
 *
 * API version: 0.1
 * Website: https://fga.dev
 * Documentation: https://docs.fga.dev
 * Support: https://discord.gg/8naAwJfWN6
 * License: [MIT](https://github.com/auth0-lab/fga-js-sdk/blob/main/LICENSE)
 *
 * NOTE: This file was auto generated by OpenAPI Generator (https://openapi-generator.tech). DO NOT EDIT.
 */


import globalAxios, { AxiosInstance } from 'axios';

import {
    FgaApiAuthenticationError,
    FgaError,
    FgaInvalidEnvironmentError,
    FgaValidationError,
} from './errors';

import { assertParamExists } from './validation';

export interface RetryParams {
    maxRetry: number;
    minWaitInMs: number;
}

export function GetDefaultRetryParams (maxRetry: number = 3, minWaitInMs: number = 100) {
  return {
    maxRetry: maxRetry,
    minWaitInMs: minWaitInMs,
  }
}

export interface UserConfigurationParams {
    storeId: string;
    clientId: string;
    clientSecret: string;
    environment?: string;
    baseOptions?: any;
    retryParams?: RetryParams;
}

export interface EnvironmentConfiguration {
    apiScheme: string;
    apiHost: string;
    apiTokenIssuer: string;
    apiAudience: string;
    allowNoAuth?: boolean;
}

const environmentConfigurationString = `{"default":{"apiAudience":"https://api.us1.fga.dev/","apiTokenIssuer":"fga.us.auth0.com","apiScheme":"https","apiHost":"api.us1.fga.dev"},"us":{"apiAudience":"https://api.us1.fga.dev/","apiTokenIssuer":"fga.us.auth0.com","apiScheme":"https","apiHost":"api.us1.fga.dev"},"playground":{"allowNoAuth":true,"apiAudience":"https://api.playground.fga.dev/","apiTokenIssuer":"sandcastle-dev.us.auth0.com","apiScheme":"https","apiHost":"api.playground.fga.dev"},"staging":{"apiAudience":"https://api.staging.fga.dev/","apiTokenIssuer":"sandcastle-dev.us.auth0.com","apiScheme":"https","apiHost":"api.staging.fga.dev"}}`;
/**
 *
 * @throws {FgaInvalidEnvironmentError}
 * @param environment - Environment from user config
 * @return EnvironmentConfiguration
 */
const getEnvironmentConfiguration = function (environment: string = 'default'): EnvironmentConfiguration {
  let environmentConfigs;
  try {
    environmentConfigs = JSON.parse(environmentConfigurationString);
  } catch (err) {
    throw new FgaInvalidEnvironmentError(environment);
  }

  const environmentConfig = environmentConfigs[environment];

  if (environmentConfig) {
    return environmentConfig;
  }

  const allowedEnvs = Object.keys(environmentConfigs);

  throw new FgaInvalidEnvironmentError(environment, allowedEnvs);
};

interface BaseOptions {
    headers: Record<string, string>;
}

export class Configuration {
    private accessToken?: string;
    private accessTokenExpiryDate?: Date;
    /**
     * provide scheme (e.g. `https`)
     *
     * @type {string}
     * @memberof Configuration
     */
    apiScheme: string = "https";
    /**
     * provide server host (e.g. `api.fga.example`)
     *
     * @type {string}
     * @memberof Configuration
     */
    apiHost: string;
    /**
     * provide storeId
     *
     * @type {string}
     * @memberof Configuration
     */
    storeId: string;
    /**
     * Client ID
     *
     * @type {string}
     * @memberof Configuration
     */
    clientId?: string;
    /**
     * Client Secret
     *
     * @type {string}
     * @memberof Configuration
     */
    clientSecret?: string;
    /**
     * API Token Issuer
     *
     * @type {string}
     * @memberof Configuration
     */
    apiTokenIssuer?: string;
    /**
     * API Audience
     *
     * @type {string}
     * @memberof Configuration
     */
    apiAudience?: string;
    /**
     * base options for axios calls
     *
     * @type {any}
     * @memberof Configuration
     */
    baseOptions?: BaseOptions;
    /**
     * retry options in the case of too many requests
     *
     * @type {RetryParams}
     * @memberof Configuration
     */
    retryParams?: RetryParams;

    constructor(params: UserConfigurationParams = {} as unknown as UserConfigurationParams, private axios: AxiosInstance = globalAxios) {
        assertParamExists('Configuration', 'storeId', params.storeId);

        const environmentConfiguration = getEnvironmentConfiguration(params.environment);

        this.apiScheme = environmentConfiguration.apiScheme || this.apiScheme;
        this.apiHost = environmentConfiguration.apiHost!;
        this.storeId = params.storeId!;
        this.clientId = params.clientId;
        this.clientSecret = params.clientSecret;
        this.apiTokenIssuer = environmentConfiguration.apiTokenIssuer;
        this.apiAudience = environmentConfiguration.apiAudience;
        const baseOptions = params.baseOptions || {};
        baseOptions.headers = baseOptions.headers || {};

        if (typeof process === 'object' && process.title === 'node' && !baseOptions.headers['User-Agent']) {
          baseOptions.headers['User-Agent'] = "auth0-fga-sdk {sdkId}/{packageVersion}".replace("{sdkId}", "js").replace("{packageVersion}", "0.7.0");
        }

        this.baseOptions = baseOptions;
        this.retryParams = params.retryParams;

        if (!environmentConfiguration.allowNoAuth) {
            assertParamExists('Configuration', 'clientId', this.clientId);
            assertParamExists('Configuration', 'clientSecret', this.clientSecret);
        }
    }

    /**
     * Ensures that the Configuration is valid
     * @return boolean
     */
    public isValid() {
      assertParamExists('Configuration', 'apiScheme', this.apiScheme);
      assertParamExists('Configuration', 'apiHost', this.apiHost);
      assertParamExists('Configuration', 'storeId', this.storeId);

      if (!Configuration.isWellFormedUriString(this.getBasePath())) {
        throw new FgaValidationError(
          `Configuration.apiScheme (${this.apiScheme}) and Configuration.apiHost (${this.apiHost}) do not form a valid URI (${this.getBasePath()})`);
      }

      if ((this.clientId || this.clientSecret) && !(this.clientId && this.clientSecret && this.apiTokenIssuer && this.apiAudience)) {
          assertParamExists('Configuration', 'clientId', this.clientId);
          assertParamExists('Configuration', 'clientSecret', this.clientSecret);
          assertParamExists('Configuration', 'apiTokenIssuer', this.apiTokenIssuer);
          assertParamExists('Configuration', 'apiAudience', this.apiAudience);
      }

      if (this.apiTokenIssuer && !Configuration.isWellFormedUriString(`https://${this.apiTokenIssuer}`)) {
        throw new FgaValidationError(
          `Configuration.apiTokenIssuer does not form a valid URI (https://${this.apiTokenIssuer})`);
      }

      if (this.retryParams?.maxRetry && this.retryParams.maxRetry > 5) {
          throw new FgaValidationError("Configuration.retryParams.maxRetry exceeds maximum allowed limit of 5");
      }

      return true;
    }

    /**
     * Returns the API base path (apiScheme+apiHost)
     */
    public getBasePath: () => string = () => `${this.apiScheme}://${this.apiHost}`;

    private static isWellFormedUriString(uri: string): boolean {
        try {
            const uriResult = new URL(uri);
            return ((uriResult.toString() === uri || uriResult.toString() === `${uri}/`) &&
                (uriResult.protocol === "https:" || uriResult.protocol === "http:"));
        } catch (err) {
            return false;
        }
    }

    /**
     * Get access token, request a new one if not cached or expired
     * @return string
     */
    public async getAccessToken() {
      this.isValid();

      if (this.accessToken && (!this.accessTokenExpiryDate || this.accessTokenExpiryDate > new Date())) {
        return this.accessToken;
      }

      return this.requestAccessToken();
    }

    /**
     * Request new access token
     * @return string
    */
    private async requestAccessToken() {
      if (!this.clientId) {
        return '';
      }

      try {
        const response = await this.axios.post(`https://${this.apiTokenIssuer}/oauth/token`, {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: this.apiAudience,
          grant_type: 'client_credentials',
        });

        this.accessToken = response.data.access_token;
        this.accessTokenExpiryDate = new Date(Date.now() + response.data.expires_in);

        return this.accessToken;
      } catch (err: unknown) {
        if (globalAxios.isAxiosError(err)) {
          throw new FgaApiAuthenticationError(err);
        }
        throw new FgaError(err);
      }
    }

    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    public isJsonMime(mime: string): boolean {
        const jsonMime: RegExp = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    }
}
