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


import { AxiosResponse, AxiosStatic } from 'axios';

import { Configuration } from "./configuration";
import {
    Auth0FgaApiError,
    Auth0FgaApiInternalError,
    Auth0FgaAuthenticationError,
    Auth0FgaApiRateLimitExceededError,
    Auth0FgaApiValidationError,
    Auth0FgaError
} from "./errors";

/**
 *
 * @export
 */
export const DUMMY_BASE_URL = 'https://example.com';

/**
 *
 * @export
 * @interface RequestArgs
 */
export interface RequestArgs {
    url: string;
    options: any;
}


/**
 *
 * @export
 */
export const setBearerAuthToObject = async function (object: any, configuration: Configuration) {
    const accessToken = await configuration.getAccessToken();
    if (accessToken) {
        object["Authorization"] = "Bearer " + accessToken;
    }
}

/**
 *
 * @export
 */
export const setSearchParams = function (url: URL, ...objects: any[]) {
    const searchParams = new URLSearchParams(url.search);
    for (const object of objects) {
        for (const key in object) {
            if (Array.isArray(object[key])) {
                searchParams.delete(key);
                for (const item of object[key]) {
                    searchParams.append(key, item);
                }
            } else {
                searchParams.set(key, object[key]);
            }
        }
    }
    url.search = searchParams.toString();
}

/**
 *
 * @export
 */
export const serializeDataIfNeeded = function (value: any, requestOptions: any, configuration: Configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : (value || "");
}

/**
 *
 * @export
 */
export const toPathString = function (url: URL) {
    return url.pathname + url.search + url.hash
}

export type CallResult<T extends {}> = T & {
    $response: AxiosResponse<T>
};

export type PromiseResult<T extends {}> = Promise<CallResult<T>>;

/**
 * creates an axios request function
 */
export const createRequestFunction = function (axiosArgs: RequestArgs, globalAxios: AxiosStatic, configuration: Configuration) {
    return async (axios: AxiosStatic = globalAxios) : PromiseResult<any> => {
        try {
            const axiosRequestArgs = {...axiosArgs.options, url: configuration.serverUrl + axiosArgs.url};
            const response = await axios.request(axiosRequestArgs);
            const data = typeof response.data === 'undefined' ? {} : response.data;
            const result: CallResult<any> = { ...data };
            Object.defineProperty(result, '$response', {
                enumerable: false,
                writable: false,
                value: response
            });
            return result;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status) {
                    if (err.response?.status === 400 || err.response?.status === 422) {
                        throw new Auth0FgaApiValidationError(err);
                    } else if (err.response?.status === 401) {
                        throw new Auth0FgaAuthenticationError(err);
                    } else if (err.response?.status === 429) {
                        throw new Auth0FgaApiRateLimitExceededError(err);
                    } else if (err.response?.status >= 500) {
                        throw new Auth0FgaApiInternalError(err);
                    }
                }
                throw new Auth0FgaApiError(err);
            }

            throw new Auth0FgaError(err as Error);
        }
    };
}
