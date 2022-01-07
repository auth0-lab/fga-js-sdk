# Changelog

## [0.5.2](https://github.com/auth0-lab/fga-js-sdk/compare/v0.5.1...v0.5.2) (2022-01-05)

- feat: expose better errors
  Errors thrown will be one of:
    Auth0FgaError, Auth0FgaApiError, Auth0FgaApiValidationError, Auth0FgaApiRateLimitExceededError,
      Auth0FgaApiInternalError, Auth0FgaAuthenticationError, Auth0FgaValidationError,
      Auth0FgaRequiredParamError, Auth0FgaInvalidEnvironmentError

  You can then check if the error is of a particular instance and handle it accordingly:
  ```typescript
  import { Auth0FgaApiRateLimitExceededError } from '@auth0/fga';

  try {
    const { allowed } = await auth0Fga.check(...);
  } catch (err) {
    if (err instanceof Auth0FgaApiRateLimitExceededError) { /* do something */ }
    /* do something else */
  }
  ```

## [0.5.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.5.0...v0.5.1) (2021-12-13)

- fix: update playground api url
- chore: update license

## [0.5.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.4.1...v0.5.0) (2021-12-10)

## Breaking Changes
- Auth0Fga prefixes have been removed from the interfaces

## [0.4.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.4.0...v0.4.1) (2021-12-03)

## Breaking Changes
- rename package `@auth0/fga`

Old package is no longer supported, please install the latest package from `@auth0/fga`

## [0.4.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.3.1...v0.4.0) (2021-12-02)

## Breaking Changes
* Package and Type prefixes have been renamed from Sandcastle to Auth0Fga

## Features
* Support Assertions API
* Support us environment

## [0.3.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.3.0...v0.3.1) (2021-11-16)

## Changes:
- feat: add support for the `poc` environment

## [0.3.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.2.0...v0.3.0) (2021-11-12)

Note: Previous versions of the SDK will no longer work with the API

## Changes:
- feat!: rename namespaces configurations
    * `namespaces` are now `types`
    * `/namespace-configurations` endpoint is now `/authorization-models`
    * Some methods were renamed:
      * `readNamespaceConfigurations` is now `readAuthzModels`
      * `readNamespaceConfiguration` is now `readAuthzModel`
      * `writeNamespaceConfiguration` is now `writeAuthzModel`

- feat!: support pagination
    * Some methods now support passing `authorization_model_id` to run against a specific version of the model
      * This is supported by the `read`, `write`, `expand` and `check` methods
    * `readNamespaceConfigurations` allows passing in `pageSize` and `continuationToken` for pagination
    * rename `readAllNamespaceConfigurations` to `readNamespaceConfigurations`

## [0.2.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.1.2...v0.2.0) (2021-10-04)

## Changes:
- feat!: drop zookies, lowercase params & update exported methods
    * drop references to Zookies
    * lowercase all parameters
      * in `check` and `expand` requests, `tupleKey` becomes `tuple_key`
      * in `write` and `read` requests `tupleKeys` becomes `tuple_keys`
    * remove `sandcastle` prefixes on methods (`sandcastleCheck` becomes `check`)
    * the methods now return the response body directly

- feat!: require passing `storeId` instead of `tenant`

## [0.1.2](https://github.com/auth0-lab/fga-js-sdk/compare/v0.1.1...v0.1.2) (2021-09-28)

## Changes:
- fix: update endpoint paths, remove `/v1`
- fix: regenerate sdk from latest API definition

## [0.1.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.1.1...v0.1.0) (2021-09-24)

## Changes:
- feat: rename `tenant` to `store`

## [0.1.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.1.0...v0.0.4) (2021-09-13)

## Changes:
- feat: require specifying environment when initializing the SDK [BREAKING CHANGE]

## Security:
- deps: bump axios to 0.21.4 to fix CVE-2021-3749

## [0.0.4](https://github.com/auth0-lab/fga-js-sdk/compare/v0.0.3...v0.0.4) (2021-07-28)

## Changes:
- feat: allow specifying the sandcastle deployment id

## [0.0.3](https://github.com/auth0-lab/fga-js-sdk/compare/v0.0.2...v0.0.3) (2021-07-22)

## Changes:
- docs: remove package version from readme

## [0.0.2](https://github.com/auth0-lab/fga-js-sdk/compare/v0.0.1...v0.0.2) (2021-07-22)

First public release

## Changes:
- chore: update readme
- feat: add sdk

## 0.0.1

Internal Release
