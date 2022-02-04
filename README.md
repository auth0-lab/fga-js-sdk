# JavaScript and Node.js SDK for Auth0 Fine Grained Authorization (FGA)

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B4989%2Fgithub.com%2Fauth0-lab%2Ffga-js-sdk.svg?type=shield)](https://app.fossa.com/projects/custom%2B4989%2Fgithub.com%2Fauth0-lab%2Ffga-js-sdk?ref=badge_shield)

This is an autogenerated JavaScript SDK for Auth0 Fine Grained Authorization (FGA). It provides a wrapper around the [Auth0 Fine Grained Authorization API](https://docs.fga.dev/api/service), and includes TS typings.

Warning: This SDK comes with no SLAs and is not production-ready!

## Table of Contents

- [About Auth0 Fine Grained Authorization](#about-auth0-fine-grained-authorization)
- [Resources](#resources)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Initializing the API Client](#initializing-the-api-client)
  - [Getting your Store ID, Client ID and Client Secret](#getting-your-store-id-client-id-and-client-secret)
  - [Calling the API](#calling-the-api)
    - [Write Authorization Model](#write-authorization-model)
    - [Read a Single Authorization Model](#read-a-single-authorization-model)
    - [Read Authorization Model IDs](#read-authorization-model-ids)
    - [Check](#check)
    - [Write Tuples](#write-tuples)
    - [Delete Tuples](#delete-tuples)
    - [Expand](#expand)
    - [Read](#read)
  - [API Endpoints](#api-endpoints)
  - [Models](#models)
- [Contributing](#contributing)
  - [Issues](#issues)
  - [Pull Requests](#pull-requests) [Note: We are not accepting Pull Requests at this time!]
- [License](#license)

## About Auth0 Fine Grained Authorization

[Auth0 Fine Grained Authorization (FGA)](https://dashboard.fga.dev) is the  early-stage product we are building at Auth0 as part of [Auth0Lab](https://twitter.com/Auth0Lab/) to solve fine-grained authorization at scale.
If you are interested in learning more about our plans, please reach out via our <a target="_blank" href="https://discord.gg/8naAwJfWN6" rel="noreferrer">Discord chat</a>.

Please note:
* At this point in time, Auth0 Fine Grained Authorization does not come with any SLAs; availability and uptime are not guaranteed.
* While this project is in its early stages, the SDK methods are in flux and might change without a major bump

## Resources

- [The Auth0 FGA Playground](https://play.fga.dev)
- [The Auth0 FGA Documentation](https://docs.fga.dev)
- [Zanzibar Academy](https://zanzibar.academy)
- [Auth0Lab on Twitter](https://twitter.com/Auth0Lab/)
- [Discord Community](https://discord.gg/pvbNmqC)

## Installation

Using [npm](https://npmjs.org):

```shell
npm install @auth0/fga
```

Using [yarn](https://yarnpkg.com):

```shell
yarn add @auth0/fga
```

## Getting Started

### Initializing the API Client

```javascript
const { Auth0FgaApi } = require('@auth0/fga'); // OR import { Auth0FgaApi } from '@auth0/fga';

const auth0Fga = new Auth0FgaApi({
  environment: AUTH0_FGA_ENVIRONMENT,
  storeId: AUTH0_FGA_STORE_ID,
  clientId: AUTH0_FGA_CLIENT_ID,
  clientSecret: AUTH0_FGA_CLIENT_SECRET,
});
```

### Getting your Store ID, Client ID and Client Secret

#### Production

Make sure you have created your credentials on the Auth0 FGA Dashboard. [Learn how ➡](https://docs.fga.dev/intro/dashboard#create-api-credentials)

You will need to set the `AUTH0_FGA_ENVIRONMENT` variable to `"us"`. Provide the store id, client id and client secret you have created on the Dashboard.

#### Playground

If you are testing this on the public playground, you need to set your `AUTH0_FGA_ENVIRONMENT` to `"playground"`.

To get your store id, you may copy it from the store you have created on the [Playground](https://play.fga.dev). [Learn how ➡](https://docs.fga.dev/intro/playground#getting-store-id)

In the playground environment, you do not need to provide a client id and client secret.

### Calling the API

#### Write Authorization Model

> Note: To learn how to build your authorization model, check the Docs at https://docs.fga.dev/

> Note: The Auth0 FGA Playground, Dashboard and Documentation use a friendly syntax which gets translated to the API syntax seen below. Learn more about [the Auth0 FGA configuration language](https://docs.fga.dev/modeling/configuration-language).

```javascript
const { id } = await auth0Fga.writeAuthorizationModel({
  type_definitions: [{
    type: "repo",
    relations: {
      "writer": { "this": {} },
      "reader": {
        "union": {
          "child": [
            { "this": {} },
            { "computedUserset": {
               "object": "",
              "relation": "writer" }
            }
          ]
        }
      }
    } }],
});

// id = "1uHxCSuTP0VKPYSnkq1pbb1jeZw"
```

#### Read a Single Authorization Model

```javascript
// Assuming `1uHxCSuTP0VKPYSnkq1pbb1jeZw` is an id of a single model
const { authorization_model: authorizationModel } = await auth0Fga.readAuthorizationModel('1uHxCSuTP0VKPYSnkq1pbb1jeZw');

// authorizationModel = { id: "1uHxCSuTP0VKPYSnkq1pbb1jeZw", type_definitions: [...] }
```

#### Read Authorization Model IDs

```javascript
const { authorization_model_ids: authorizationModelIds } = await auth0Fga.readAuthorizationModels();

// authorizationModelIds = ["1uHxCSuTP0VKPYSnkq1pbb1jeZw", "GtQpMohWezFmIbyXxVEocOCxxgq"];
```

#### Check
> Provide a tuple and ask the Auth0 FGA API to check for a relationship

```javascript
const result = await auth0Fga.check({
  tuple_key: {
    user: "81684243-9356-4421-8fbf-a4f8d36aa31b",
    relation: "admin",
    object: "workspace:675bcac4-ad38-4fb1-a19a-94a5648c91d6",
  },
});

// result = { allowed: true, resolution: "" }
```

#### Write Tuples

```javascript
await auth0Fga.write({
  writes: {
    tuple_keys: [{ user: "anne", relation: "reader", object: "repo:auth0/express-jwt" }],
  },
});

```

#### Delete Tuples

```javascript
await auth0Fga.write({
  deletes: {
    tuple_keys: [{ user: "anne", relation: "reader", object: "repo:auth0/express-jwt" }],
  },
});

```

#### Expand

```javascript
const { tree } = await auth0Fga.expand({
  tuple_key: {
    relation: "admin",
    object: "workspace:675bcac4-ad38-4fb1-a19a-94a5648c91d6",
  },
});

// tree = {...}
```

#### Read

```javascript
// Find if a relationship tuple stating that a certain user is an admin on a certain workspace
const body = {
  tuple_key: {
    user: "81684243-9356-4421-8fbf-a4f8d36aa31b",
    relation: "admin",
    object: "workspace:675bcac4-ad38-4fb1-a19a-94a5648c91d6",
  },
};

// Find all relationship tuples where a certain user has a relationship as any relation to a certain workspace
const body = {
  tuple_key: {
    user: "81684243-9356-4421-8fbf-a4f8d36aa31b",
    object: "workspace:675bcac4-ad38-4fb1-a19a-94a5648c91d6",
  },
};

// Find all relationship tuples where a certain user is an admin on any workspace
const body = {
  tuple_key: {
    user: "81684243-9356-4421-8fbf-a4f8d36aa31b",
    relation: "admin",
    object: "workspace:",
  },
};

// Find all relationship tuples where any user has a relationship as any relation with a particular workspace
const body = {
  tuple_key: {
    object: "workspace:675bcac4-ad38-4fb1-a19a-94a5648c91d6",
  },
};

const { tuples } = await auth0Fga.read(body);

// In all the above situations, the response will be of the form:
// tuples = [{ key: { user, relation, object }, timestamp: ... }]
```

### API Endpoints

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**check**](#check) | **POST** /{store_id}/check | Check whether a user is authorized to access an object |
| [**deleteTokenIssuer**](#deletetokenissuer) | **DELETE** /{store_id}/settings/token-issuers/{id} | Remove 3rd party token issuer for Auth0 FGA read and write operation |
| [**expand**](#expand) | **POST** /{store_id}/expand | Expand all relationships in userset tree format, and following userset rewrite rules.  Useful to reason about and debug a certain relationship |
| [**read**](#read) | **POST** /{store_id}/read | Get tuples from the store that matches a query, without following userset rewrite rules |
| [**readAssertions**](#readassertions) | **GET** /{store_id}/assertions/{authorization_model_id} | Read assertions for an authorization model ID |
| [**readAuthorizationModel**](#readauthorizationmodel) | **GET** /{store_id}/authorization-models/{id} | Return a particular version of an authorization model |
| [**readAuthorizationModels**](#readauthorizationmodels) | **GET** /{store_id}/authorization-models | Return all the authorization model IDs for a particular store |
| [**readSettings**](#readsettings) | **GET** /{store_id}/settings | Return store settings, including the environment tag |
| [**write**](#write) | **POST** /{store_id}/write | Add or delete tuples from the store |
| [**writeAssertions**](#writeassertions) | **PUT** /{store_id}/assertions/{authorization_model_id} | Upsert assertions for an authorization model ID |
| [**writeAuthorizationModel**](#writeauthorizationmodel) | **POST** /{store_id}/authorization-models | Create a new authorization model |
| [**writeSettings**](#writesettings) | **PATCH** /{store_id}/settings | Update the environment tag for a store |
| [**writeTokenIssuer**](#writetokenissuer) | **POST** /{store_id}/settings/token-issuers | Add 3rd party token issuer for Auth0 FGA read and write operations |

#### check


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**CheckRequestParams**](#CheckRequestParams) |  | |

##### Return type

[**CheckResponse**](#CheckResponse)


#### deleteTokenIssuer


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string** | Id of token issuer to be removed | [default to undefined]|

##### Return type

**object**


#### expand


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**ExpandRequestParams**](#ExpandRequestParams) |  | |

##### Return type

[**ExpandResponse**](#ExpandResponse)


#### read


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**ReadRequestParams**](#ReadRequestParams) |  | |

##### Return type

[**ReadResponse**](#ReadResponse)


#### readAssertions


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **authorizationModelId** | **string** |  | [default to undefined]|

##### Return type

[**ReadAssertionsResponse**](#ReadAssertionsResponse)


#### readAuthorizationModel


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string** |  | [default to undefined]|

##### Return type

[**ReadAuthorizationModelResponse**](#ReadAuthorizationModelResponse)


#### readAuthorizationModels


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **pageSize** | **number** |  | [default to undefined]|| **continuationToken** | **string** |  | [default to undefined]|

##### Return type

[**ReadAuthorizationModelsResponse**](#ReadAuthorizationModelsResponse)


#### readSettings


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |


##### Return type

[**ReadSettingsResponse**](#ReadSettingsResponse)


#### write


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**WriteRequestParams**](#WriteRequestParams) |  | |

##### Return type

**object**


#### writeAssertions


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **authorizationModelId** | **string** |  | [default to undefined]|| **body** | [**WriteAssertionsRequestParams**](#WriteAssertionsRequestParams) |  | |

##### Return type

**object**


#### writeAuthorizationModel


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**TypeDefinitions**](#TypeDefinitions) |  | |

##### Return type

[**WriteAuthorizationModelResponse**](#WriteAuthorizationModelResponse)


#### writeSettings


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**WriteSettingsRequestParams**](#WriteSettingsRequestParams) |  | |

##### Return type

[**WriteSettingsResponse**](#WriteSettingsResponse)


#### writeTokenIssuer


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**WriteTokenIssuersRequestParams**](#WriteTokenIssuersRequestParams) |  | |

##### Return type

[**WriteTokenIssuersResponse**](#WriteTokenIssuersResponse)


### Models

 - [Any](#Any)
 - [Assertion](#Assertion)
 - [AuthorizationModel](#AuthorizationModel)
 - [AuthorizationmodelDifference](#AuthorizationmodelDifference)
 - [AuthorizationmodelTupleToUserset](#AuthorizationmodelTupleToUserset)
 - [CheckRequestParams](#CheckRequestParams)
 - [CheckResponse](#CheckResponse)
 - [Computed](#Computed)
 - [Environment](#Environment)
 - [ExpandRequestParams](#ExpandRequestParams)
 - [ExpandResponse](#ExpandResponse)
 - [Leaf](#Leaf)
 - [Node](#Node)
 - [Nodes](#Nodes)
 - [ObjectRelation](#ObjectRelation)
 - [ReadAssertionsResponse](#ReadAssertionsResponse)
 - [ReadAuthorizationModelResponse](#ReadAuthorizationModelResponse)
 - [ReadAuthorizationModelsResponse](#ReadAuthorizationModelsResponse)
 - [ReadRequestParams](#ReadRequestParams)
 - [ReadResponse](#ReadResponse)
 - [ReadSettingsResponse](#ReadSettingsResponse)
 - [ReadTuplesRequestParams](#ReadTuplesRequestParams)
 - [ReadTuplesResponse](#ReadTuplesResponse)
 - [Status](#Status)
 - [TokenIssuer](#TokenIssuer)
 - [Tuple](#Tuple)
 - [TupleKey](#TupleKey)
 - [TupleKeys](#TupleKeys)
 - [TypeDefinition](#TypeDefinition)
 - [TypeDefinitions](#TypeDefinitions)
 - [Users](#Users)
 - [Userset](#Userset)
 - [UsersetTree](#UsersetTree)
 - [UsersetTreeDifference](#UsersetTreeDifference)
 - [UsersetTreeTupleToUserset](#UsersetTreeTupleToUserset)
 - [Usersets](#Usersets)
 - [WriteAssertionsRequestParams](#WriteAssertionsRequestParams)
 - [WriteAuthorizationModelResponse](#WriteAuthorizationModelResponse)
 - [WriteRequestParams](#WriteRequestParams)
 - [WriteSettingsRequestParams](#WriteSettingsRequestParams)
 - [WriteSettingsResponse](#WriteSettingsResponse)
 - [WriteTokenIssuersRequestParams](#WriteTokenIssuersRequestParams)
 - [WriteTokenIssuersResponse](#WriteTokenIssuersResponse)


#### Any

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** |  | [optional] [default to undefined]

#### Assertion

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tuple_key** | [**TupleKey**](#TupleKey) |  | [default to undefined]
**expectation** | **boolean** |  | [default to undefined]

#### AuthorizationModel

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**type_definitions** | [**TypeDefinition**[]](#TypeDefinition) |  | [optional] [default to undefined]

#### AuthorizationmodelDifference

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base** | [**Userset**](#Userset) |  | [default to undefined]
**subtract** | [**Userset**](#Userset) |  | [default to undefined]

#### AuthorizationmodelTupleToUserset

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tupleset** | [**ObjectRelation**](#ObjectRelation) |  | [optional] [default to undefined]
**computedUserset** | [**ObjectRelation**](#ObjectRelation) |  | [optional] [default to undefined]

#### CheckRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tuple_key** | [**TupleKey**](#TupleKey) |  | [optional] [default to undefined]
**authorization_model_id** | **string** |  | [optional] [default to undefined]
**trace** | **boolean** | Defaults to false. Making it true has performance implications. | [optional] [readonly] [default to undefined]

#### CheckResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**allowed** | **boolean** |  | [optional] [default to undefined]
**resolution** | **string** | For internal use only. | [optional] [default to undefined]

#### Computed

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userset** | **string** |  | [optional] [default to undefined]

#### Environment

##### Enum


* `EnvironmentUnspecified` (value: `'ENVIRONMENT_UNSPECIFIED'`)

* `Development` (value: `'DEVELOPMENT'`)

* `Staging` (value: `'STAGING'`)

* `Production` (value: `'PRODUCTION'`)


#### ExpandRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tuple_key** | [**TupleKey**](#TupleKey) |  | [optional] [default to undefined]
**authorization_model_id** | **string** |  | [optional] [default to undefined]

#### ExpandResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tree** | [**UsersetTree**](#UsersetTree) |  | [optional] [default to undefined]

#### Leaf

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**users** | [**Users**](#Users) |  | [optional] [default to undefined]
**computed** | [**Computed**](#Computed) |  | [optional] [default to undefined]
**tupleToUserset** | [**UsersetTreeTupleToUserset**](#UsersetTreeTupleToUserset) |  | [optional] [default to undefined]

#### Node

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [optional] [default to undefined]
**leaf** | [**Leaf**](#Leaf) |  | [optional] [default to undefined]
**difference** | [**UsersetTreeDifference**](#UsersetTreeDifference) |  | [optional] [default to undefined]
**union** | [**Nodes**](#Nodes) |  | [optional] [default to undefined]
**intersection** | [**Nodes**](#Nodes) |  | [optional] [default to undefined]

#### Nodes

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**nodes** | [**Node**[]](#Node) |  | [optional] [default to undefined]

#### ObjectRelation

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**object** | **string** |  | [optional] [default to undefined]
**relation** | **string** |  | [optional] [default to undefined]

#### ReadAssertionsResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**authorization_model_id** | **string** |  | [optional] [default to undefined]
**assertions** | [**Assertion**[]](#Assertion) |  | [optional] [default to undefined]

#### ReadAuthorizationModelResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**authorization_model** | [**AuthorizationModel**](#AuthorizationModel) |  | [optional] [default to undefined]

#### ReadAuthorizationModelsResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**authorization_model_ids** | **string** |  | [optional] [default to undefined]
**continuation_token** | **string** |  | [optional] [default to undefined]

#### ReadRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tuple_key** | [**TupleKey**](#TupleKey) |  | [optional] [default to undefined]
**authorization_model_id** | **string** |  | [optional] [default to undefined]

#### ReadResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tuples** | [**Tuple**[]](#Tuple) |  | [optional] [default to undefined]

#### ReadSettingsResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**environment** | [**Environment**](#Environment) |  | [optional] [default to undefined]
**token_issuers** | [**TokenIssuer**[]](#TokenIssuer) |  | [optional] [default to undefined]

#### ReadTuplesRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**page_size** | **number** |  | [optional] [default to undefined]
**continuation_token** | **string** |  | [optional] [default to undefined]

#### ReadTuplesResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tuples** | [**Tuple**[]](#Tuple) |  | [optional] [default to undefined]
**continuation_token** | **string** |  | [optional] [default to undefined]

#### Status

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **number** |  | [optional] [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**details** | [**Any**[]](#Any) |  | [optional] [default to undefined]

#### TokenIssuer

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**issuer_url** | **string** |  | [optional] [default to undefined]

#### Tuple

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | [**TupleKey**](#TupleKey) |  | [optional] [default to undefined]
**timestamp** | **string** |  | [optional] [default to undefined]

#### TupleKey

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**object** | **string** |  | [optional] [default to undefined]
**relation** | **string** |  | [optional] [default to undefined]
**user** | **string** |  | [optional] [default to undefined]

#### TupleKeys

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tuple_keys** | [**TupleKey**[]](#TupleKey) |  | [default to undefined]

#### TypeDefinition

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** |  | [default to undefined]
**relations** | [**Record<string, Userset**>](#Userset) |  | [default to undefined]

#### TypeDefinitions

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type_definitions** | [**TypeDefinition**[]](#TypeDefinition) |  | [optional] [default to undefined]

#### Users

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**users** | **string** |  | [optional] [default to undefined]

#### Userset

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**_this** | **object** | A DirectUserset is a sentinel message for referencing the direct members specified by an object/relation mapping. | [optional] [default to undefined]
**computedUserset** | [**ObjectRelation**](#ObjectRelation) |  | [optional] [default to undefined]
**tupleToUserset** | [**AuthorizationmodelTupleToUserset**](#AuthorizationmodelTupleToUserset) |  | [optional] [default to undefined]
**union** | [**Usersets**](#Usersets) |  | [optional] [default to undefined]
**intersection** | [**Usersets**](#Usersets) |  | [optional] [default to undefined]
**difference** | [**AuthorizationmodelDifference**](#AuthorizationmodelDifference) |  | [optional] [default to undefined]

#### UsersetTree

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**root** | [**Node**](#Node) |  | [optional] [default to undefined]

#### UsersetTreeDifference

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base** | [**Node**](#Node) |  | [optional] [default to undefined]
**subtract** | [**Node**](#Node) |  | [optional] [default to undefined]

#### UsersetTreeTupleToUserset

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tupleset** | **string** |  | [optional] [default to undefined]
**computed** | [**Computed**[]](#Computed) |  | [optional] [default to undefined]

#### Usersets

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**child** | [**Userset**[]](#Userset) |  | [optional] [default to undefined]

#### WriteAssertionsRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**assertions** | [**Assertion**[]](#Assertion) |  | [default to undefined]

#### WriteAuthorizationModelResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**authorization_model_id** | **string** |  | [optional] [default to undefined]

#### WriteRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**writes** | [**TupleKeys**](#TupleKeys) |  | [optional] [default to undefined]
**deletes** | [**TupleKeys**](#TupleKeys) |  | [optional] [default to undefined]
**authorization_model_id** | **string** |  | [optional] [default to undefined]
**lock_tuple** | [**Tuple**](#Tuple) |  | [optional] [default to undefined]

#### WriteSettingsRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**environment** | [**Environment**](#Environment) |  | [optional] [default to undefined]

#### WriteSettingsResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**environment** | [**Environment**](#Environment) |  | [optional] [default to undefined]
**token_issuers** | [**TokenIssuer**[]](#TokenIssuer) |  | [optional] [default to undefined]

#### WriteTokenIssuersRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**issuer_url** | **string** |  | [optional] [default to undefined]

#### WriteTokenIssuersResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]



## Contributing

### Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository [issues](https://github.com/auth0-lab/fga-js-sdk/issues) section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/responsible-disclosure-policy) details the procedure for disclosing security issues.

For auth0 related questions/support please use the [Support Center](https://support.auth0.com).

### Pull Requests

Pull Requests are not currently open, please [raise an issue](https://github.com/auth0-lab/fga-js-sdk/issues) or contact a team member on https://discord.gg/8naAwJfWN6 if there is a feature you'd like us to implement.

## Author

[Auth0Lab](https://github.com/auth0-lab)

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/auth0-lab/fga-js-sdk/blob/main/LICENSE) file for more info.

The code in this repo was auto generated by [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator) from a template based on the [typescript-axios template](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/typescript-axios) and [go template](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/go), licensed under the [Apache License 2.0](https://github.com/OpenAPITools/openapi-generator/blob/master/LICENSE).
