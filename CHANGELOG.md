# Changelog

## v0.10.0

### [0.10.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.9.1...v0.10.0) (2023-12-23)

[Breaking]

Changed:
- `Auth0FgaApi` and `Auth0FgaClient` are now just simple wrappers on top of `OpenFgaFgaApi` and `OpenFgaFgaClient`

Chore:
- chore(ci): enable dependabot
- chore(deps): update dependencies

Note: As of this point this SDK is deprecated and should no longer be used. Please use [@openfga/sdk](https://github.com/openfga/js-sdk) instead.

We strongly recommend you use the `@openfga/sdk` directly instead with the following configuration:

For US1 (Production US) environment, use the following values:
- API URL: `https://api.us1.fga.dev`
- Credential Method: ClientCredentials
- API Token Issuer: `fga.us.auth0.com`
- API Audience: `https://api.us1.fga.dev/`

You can get the rest of the necessary variables from the FGA Dashboard. See [here](https://docs.fga.dev/intro/dashboard#create-api-credentials).

```js
const { CredentialsMethod, OpenFgaClient } = require('@openfga/sdk'); // OR import { CredentialsMethod, OpenFgaClient } from '@openfga/sdk';

const fgaClient = new OpenFgaClient({
    apiUrl: "https://api.us1.fga.dev",
    storeId: process.env.FGA_STORE_ID,
    authorizationModelId: process.env.FGA_MODEL_ID,
    credentials: {
      method: CredentialsMethod.ClientCredentials,
      config: {
        apiTokenIssuer: "fga.us.auth0.com",
        apiAudience: "https://api.us1.fga.dev/",
        clientId: process.env.FGA_CLIENT_ID,
        clientSecret: process.env.FGA_CLIENT_SECRET,
      },
    }
});
```

## v0.9.1

### [0.9.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.9.0...v0.9.1) (2023-01-23)

Fixes:
- fix(deps): update `@openfga/sdk` to `v0.2.2` to resolve an issue with caching the client credentials token

Chore:
- chore(deps): update dev dependencies

## v0.9.0

### [0.9.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.8.0...v0.9.0) (2022-12-16)

Changes:
- [BREAKING] feat(list-objects)!: response has been changed to include the object type
    e.g. response that was `{"object_ids":["roadmap"]}`, will now be `{"objects":["document:roadmap"]}`
- feat(configuration): expose environment configurations

Fixes:
- [BREAKING] fix(models)!: update interfaces that had incorrectly optional fields to make them required

Chore:
- chore(deps): update `@openfga/sdk` to `v0.2.0`
- chore(deps): update dev dependencies

## v0.8.0

### [0.8.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.7.0...v0.8.0) (2022-10-13)

#### Changes
- BREAKING: exported type `TypeDefinitions` is now `WriteAuthorizationModelRequest`
    Note: This is only a breaking change on the SDK, not the API.
- Support ListObjects
    Support for [ListObjects API](https://docs.fga.dev/api/service#/Relationship%20Queries/ListObjects)

    You call the API and receive the list of object ids from a particular type that the user has a certain relation with.

    For example, to find the list of documents that Anne can read:

    ```javascript
    const response = await auth0FgaApi.listObjects({
      user: "user:anne",
      relation: "can_read",
      type: "document"
    });

    // response.object_ids = ["roadmap"]
    ```
- Use [OpenFGA JS SDK](https://github.com/openfga/js-sdk) as the base SDK
- bump dependencies

## v0.7.0

### [0.7.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.6.4...v0.7.0) (2022-06-07)

#### Changes
- feat!: [ReadAuthorizationModels](https://docs.fga.dev/api/service#/Store%20Models/ReadAuthorizationModels) now returns an array of Authorization Models instead of IDs [BREAKING CHANGE]

    The response will become similar to:
    ```json
    {
        "authorization_models": [
            {
              "id": (string),
              "type_definitions": [...]
            }
        ]
    }
    ```
- feat!: drop support for all settings endpoints [BREAKING CHANGE]
- feat!: Simplify error prefix to `Fga` [BREAKING CHANGE]

    Possible Errors:
    - `FgaError`: All errors thrown by the SDK extend this error
    - `FgaApiError`: All errors returned by the API extend this error
    - `FgaApiValidationError`: 400 and 422 Validation Errors returned by the API
    - `FgaApiNotFoundError`: 404 errors returned by the API
    - `FgaApiRateLimitExceededError`: 429 errors returned by the API
    - `FgaApiInternalError`: 5xx errors returned by the API
    - `FgaApiAuthenticationError`: Error during authentication
    - `FgaValidationError`: Error thrown by the SDK when validating input
    - `FgaRequiredParamError`: Error thrown by the SDK when a required parameter is not provided
    - `FgaInvalidEnvironmentError`: Error thrown by the SDK when the provided environment is invalid
- feat!: drop `Params` postfix from the name of the request interface [BREAKING CHANGE]

  e.g. `ReadRequestParams` will become `ReadRequest`
- feat: add support for [contextual tuples](https://docs.fga.dev/intro/auth0-fga-concepts#what-are-contextual-tuples) in the [Check](https://docs.fga.dev/api/service#/Tuples/Check) request

    You can call them like so:
    ```js
    const { allowed } = await fgaClient.check({
      tuple_key: {
        user: 'anne',
        relation: 'can_view',
        object: 'transaction:A',
      },
      contextual_tuples: {
        tuple_keys: [
          {
            user: "anne",
            relation: "user",
            object: "ip-address-range:10.0.0.0/16"
          },
          {
            user: "anne",
            relation: "user",
            object: "timeslot:18_19"
          }
        ]
      }});
    ```
- chore: upgrade dependencies
- chore: internal refactor

## v0.6.4

### [0.6.4](https://github.com/auth0-lab/fga-js-sdk/compare/v0.6.3...v0.6.4) (2022-03-17)

#### Changes
- chore: upgrade dependencies
  resolves [CVE-2021-44906](https://nvd.nist.gov/vuln/detail/CVE-2021-44906) in the `minimist` dev dependency

## v0.6.3

### [0.6.3](https://github.com/auth0-lab/fga-js-sdk/compare/v0.6.2...v0.6.3) (2022-03-17)

#### Changes
- chore: send user agent header in non-browser environments
- feat: add support for the Watch API
- fix: rename invalid "this" in tuple key to "this"

## v0.6.2

### [0.6.2](https://github.com/auth0-lab/fga-js-sdk/compare/v0.6.1...v0.6.2) (2022-03-09)

#### Changes
- fix: fix for return types on 204 no content
- chore: enable ci publish and release

## v0.6.1

### [0.6.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.6.0...v0.6.1) (2022-03-07)

#### Changes
- feat(error-handling): expose new api error codes

## v0.6.0

### [0.6.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.5.2...v0.6.0) (2022-02-09)

#### Changes
- feat: update interfaces for latest api breaking changes
- chore(deps): update dependencies

## v0.5.2

### [0.5.2](https://github.com/auth0-lab/fga-js-sdk/compare/v0.5.1...v0.5.2) (2022-01-05)

#### Changes
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

## v0.5.1

### [0.5.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.5.0...v0.5.1) (2021-12-13)

#### Changes
- fix: update playground api url
- chore: update license

## v0.5.0

### [0.5.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.4.1...v0.5.0) (2021-12-10)

#### Breaking Changes
- Auth0Fga prefixes have been removed from the interfaces

## v0.4.1

### [0.4.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.4.0...v0.4.1) (2021-12-03)

#### Breaking Changes
- rename package `@auth0/fga`

Old package is no longer supported, please install the latest package from `@auth0/fga`

## v0.4.0

### [0.4.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.3.1...v0.4.0) (2021-12-02)

#### Breaking Changes
- Package and Type prefixes have been renamed from Sandcastle to Auth0Fga

#### Features
- Support Assertions API
- Support us environment

## v0.3.1

### [0.3.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.3.0...v0.3.1) (2021-11-16)

#### Changes
- feat: add support for the `poc` environment

## v0.3.0

### [0.3.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.2.0...v0.3.0) (2021-11-12)

Note: Previous versions of the SDK will no longer work with the API

#### Changes
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

## v0.2.0

### [0.2.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.1.2...v0.2.0) (2021-10-04)

#### Changes
- feat!: drop zookies, lowercase params & update exported methods
    * drop references to Zookies
    * lowercase all parameters
      * in `check` and `expand` requests, `tupleKey` becomes `tuple_key`
      * in `write` and `read` requests `tupleKeys` becomes `tuple_keys`
    * remove `sandcastle` prefixes on methods (`sandcastleCheck` becomes `check`)
    * the methods now return the response body directly

- feat!: require passing `storeId` instead of `tenant`

## v0.1.2

### [0.1.2](https://github.com/auth0-lab/fga-js-sdk/compare/v0.1.1...v0.1.2) (2021-09-28)

#### Changes
- fix: update endpoint paths, remove `/v1`
- fix: regenerate sdk from latest API definition

## v0.1.1

### [0.1.1](https://github.com/auth0-lab/fga-js-sdk/compare/v0.1.1...v0.1.0) (2021-09-24)

#### Changes
- feat: rename `tenant` to `store`

## v0.1.0

### [0.1.0](https://github.com/auth0-lab/fga-js-sdk/compare/v0.1.0...v0.0.4) (2021-09-13)

#### Changes
- feat: require specifying environment when initializing the SDK [BREAKING CHANGE]

#### Security
- deps: bump axios to 0.21.4 to fix CVE-2021-3749

## v0.0.4

### [0.0.4](https://github.com/auth0-lab/fga-js-sdk/compare/v0.0.3...v0.0.4) (2021-07-28)

#### Changes
- feat: allow specifying the sandcastle deployment id

## v0.0.3

### [0.0.3](https://github.com/auth0-lab/fga-js-sdk/compare/v0.0.2...v0.0.3) (2021-07-22)

#### Changes
- docs: remove package version from readme

## v0.0.2

### [0.0.2](https://github.com/auth0-lab/fga-js-sdk/compare/v0.0.1...v0.0.2) (2021-07-22)

First public release

### Changes
- chore: update readme
- feat: add sdk

## v0.0.1

Internal Release
