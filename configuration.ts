/* tslint:disable */
/* eslint-disable */
/**
 * JavaScript and Node.js SDK for Auth0 Fine Grained Authorization (FGA)
 *
 * Auth0 Fine Grained Authorization (FGA) is an early-stage product we are building at Auth0 as part of Auth0Lab to solve fine-grained authorization at scale. If you are interested in learning more about our plans, please reach out via our Discord chat.  The limits and information described in this document is subject to change.
 *
 * API version: 0.1
 * Website: https://fga.dev
 * Documentation: https://docs.fga.dev
 * Support: https://discord.gg/8naAwJfWN6
 *
 * NOTE: This file was auto generated by OpenAPI Generator (https://openapi-generator.tech). DO NOT EDIT.
 */


import globalAxios, { AxiosInstance } from 'axios';

import {
    Auth0FgaInvalidEnvironmentError,
    Auth0FgaAuthenticationError,
    Auth0FgaError
} from './errors';

import { assertParamExists } from './validation';

export interface RetryParams {
    maxRetry: number;
    minWaitInMs: number;
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
    host: string;
    scheme: string;
    apiTokenIssuer: string;
    apiAudience: string;
    allowNoAuth?: boolean;
}

const environmentConfigurationString = `{"default":{"apiAudience":"https://api.us1.fga.dev/","apiTokenIssuer":"fga.us.auth0.com","scheme":"https","host":"api.us1.fga.dev"},"us":{"apiAudience":"https://api.us1.fga.dev/","apiTokenIssuer":"fga.us.auth0.com","scheme":"https","host":"api.us1.fga.dev"},"playground":{"allowNoAuth":true,"apiAudience":"https://api.playground.fga.dev/","apiTokenIssuer":"sandcastle-dev.us.auth0.com","scheme":"https","host":"api.playground.fga.dev"},"staging":{"apiAudience":"https://api.staging.fga.dev/","apiTokenIssuer":"sandcastle-dev.us.auth0.com","scheme":"https","host":"api.staging.fga.dev"},"poc":{"apiAudience":"https://api.poc.sandcastle.cloud","apiTokenIssuer":"sandcastle-dev.us.auth0.com","scheme":"https","host":"api.poc.sandcastle.cloud"}}`;

export function GetDefaultRetryParams (maxRetry: number = 3, minWaitInMs: number = 100) {
  return {
    maxRetry: maxRetry,
    minWaitInMs: minWaitInMs,
  }
}

/**
 *
 * @throws {InvalidEnvironmentError}
 * @param environment - Environment from user config
 * @return EnvironmentConfiguration
 */
const getEnvironmentConfiguration = function (environment: string = 'default'): EnvironmentConfiguration {
  let environmentConfigs;
  try {
    environmentConfigs = JSON.parse(environmentConfigurationString);
  } catch (err) {
    throw new Auth0FgaInvalidEnvironmentError(environment);
  }

  const environmentConfig = environmentConfigs[environment];

  if (environmentConfig) {
    return environmentConfig;
  }

  const allowedEnvs = Object.keys(environmentConfigs);

  throw new Auth0FgaInvalidEnvironmentError(environment, allowedEnvs);
};

interface BaseOptions {
    headers: Record<string, string>;
}

export class Configuration {
    private accessToken?: string;
    private accessTokenExpiryDate?: Date;
    /**
     * provide server url
     *
     * @type {string}
     * @memberof Configuration
     */
    serverUrl: string;
    /**
     * provide storeId
     *
     * @type {string}
     * @memberof Configuration
     */
    storeId: string;
    /**
     * Auth0 FGA Client ID
     *
     * @type {string}
     * @memberof Configuration
     */
    clientId?: string;
    /**
     * Auth0 FGA Client Secret
     *
     * @type {string}
     * @memberof Configuration
     */
    clientSecret?: string;
    /**
     * Auth0 FGA API Token Issuer
     *
     * @type {string}
     * @memberof Configuration
     */
    apiTokenIssuer?: string;
    /**
     * Auth0 FGA API Audience
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

        this.storeId = params.storeId!;
        this.clientId = params.clientId;
        this.clientSecret = params.clientSecret;
        const baseOptions = params.baseOptions || {};
        baseOptions.headers = baseOptions.headers || {};

        if (typeof process === 'object' && process.title === 'node' && !baseOptions.headers['User-Agent']) {
          baseOptions.headers['User-Agent'] = "auth0-fga-sdk {sdkId}/{packageVersion}".replace("{sdkId}", "js").replace("{packageVersion}", "0.6.4");
        }

        this.serverUrl = `${environmentConfiguration.scheme}://${environmentConfiguration.host}`;
        this.apiTokenIssuer = environmentConfiguration.apiTokenIssuer;
        this.apiAudience = environmentConfiguration.apiAudience;
        this.baseOptions = baseOptions;

        this.retryParams = params.retryParams;

        if (!environmentConfiguration.allowNoAuth) {
            assertParamExists('Configuration', 'clientId', this.clientId);
            assertParamExists('Configuration', 'clientSecret', this.clientSecret);
        }
    }

    /**
     * Get access token, request a new one if not cached or expired
     * @return string
     */
    public async getAccessToken() {
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
          throw new Auth0FgaAuthenticationError(err);
        }
        throw new Auth0FgaError(err);
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
