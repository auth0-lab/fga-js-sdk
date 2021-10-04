/* tslint:disable */
/* eslint-disable */
/**
 * Sandcastle
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1
 * Contact: https://discord.gg/8naAwJfWN6
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from "./configuration";
import { AxiosInstance, AxiosResponse } from 'axios';

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
export const createRequestFunction = function (axiosArgs: RequestArgs, globalAxios: AxiosInstance, configuration: Configuration) {
    return async (axios: AxiosInstance = globalAxios) : PromiseResult<any> => {
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
    };
}
