# Sandcastle JS SDK

This is an autogenerated JS/TS Sandcastle SDK. It provides a wrapper around the Sandcastle API and includes TS typings.

## Table of Contents

- [About Sandcastle](#about-sandcastle)
- [Resources](#resources)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Initializing the Sandcastle API Client](#initializing-the-sandcastle-api-client)
  - [Getting your Sandcastle Store ID, Client ID and Client Secret](#getting-your-sandcastle-store-id-client-id-and-client-secret)
  - [Calling the API](#calling-the-api)
    - [Write Namespaces Configuration](#write-namespaces-configuration)
    - [Read a Single Namespaces Configuration](#read-a-single-namespaces-configuration)
    - [Read All Namespaces Configuration](#read-all-namespaces-configuration)
    - [Check](#check)
    - [Write Tuples](#write-tuples)
    - [Delete Tuples](#delete-tuples)
    - [Expand](#expand)
    - [Read](#read)
  - [API Endpoints](#api-endpoints)
  - [Models](#models)
- [License](#license)

## About Sandcastle

[Auth0 Sandcastle](https://learn.sandcastle.cloud) is the internal codename of an early-stage product we are building at Auth0 as part of [Auth0Lab](https://twitter.com/Auth0Lab/) to solve fine-grained authorization at scale.
If you are interested in learning more about our plans, please reach out via our <a target="_blank" href="https://discord.gg/8naAwJfWN6" rel="noreferrer">Discord chat</a>.

Please note:
* At this point in time, Sandcastle does not come with any SLAs; availability and uptime are not guaranteed.
* While this project is in it's early stages, the sdk methods are in flux and might change without a major bump

## Resources

- [Sandcastle Playground](https://learn.sandcastle.cloud)
- [Sandcastle Tutorials](https://learn.sandcastle.cloud/tutorials)
- [Auth0Lab on Twitter](https://twitter.com/Auth0Lab/)
- [Discord Community](https://discord.gg/pvbNmqC)

## Installation

Using [npm](https://npmjs.org):

```shell
npm install sandcastle-sdk
```

Using [yarn](https://yarnpkg.com):

```shell
yarn add sandcastle-sdk
```

## Getting Started

### Initializing the Sandcastle API Client

```javascript
const { SandcastleApi } = require('sandcastle-sdk'); // OR import { SandcastleApi } from 'sandcastle-sdk';

const sandcastleApi = new SandcastleApi({
  environment: SANDCASTLE_ENVIRONMENT,
  storeId: SANDCASTLE_STORE_ID,
  clientId: SANDCASTLE_CLIENT_ID,
  clientSecret: SANDCASTLE_CLIENT_SECRET,
});
```

### Getting your Sandcastle Store ID, Client ID and Client Secret

#### PoC

Currently, Sandcastle is at a PoC stage. You can request to join the PoC at https://discord.gg/8naAwJfWN6

If you are in the PoC, you need to set the `SANDCASTLE_ENVIRONMENT` to "staging". Provide the store id, client id and client secret you have received from us.

#### Playground

If you are testing this on the public playground, you need to set your `SANDCASTLE_ENVIRONMENT` to "playground".

To get your store id, you may copy it from the store you have created on the [Playground](https://learn.sandcastle.cloud).

In the playground environment, you do not need to provide a client id and client secret.

### Calling the API

#### Write Namespaces Configuration

> Note: To learn how to build namespace configurations, check the Sandcastle Playground tutorials at https://learn.sandcastle.cloud/intro

> Note: The Sandcastle Playground uses an experimental friendly yaml syntax which gets translated to the API syntax seen below, let us know your feedback at https://discord.gg/8naAwJfWN6

```javascript
const { data } = await sandcastleApi.sandcastleWriteNamespaceConfiguration({
  namespaces: [{
    name: "github-repo",
    relations: {
      "repo_writer": { "this": {} },
      "repo_reader": {
        "union": {
          "child": [
            { "this": {} },
            { "computedUserset": {
               "object": "",
              "relation": "repo_writer" }
            }
          ]
        }
      }
    } }],
});

// data = { id: "...", zookie: "" }
```

#### Read a Single Namespaces Configuration

```javascript
// Assuming `1uHxCSuTP0VKPYSnkq1pbb1jeZw` is an id of a configuration
const { data } = await sandcastleApi.sandcastleReadNamespaceConfiguration('1uHxCSuTP0VKPYSnkq1pbb1jeZw');

// data = { configuration: { id: "1uHxCSuTP0VKPYSnkq1pbb1jeZw", namespaces: { namespaces: [{ name: "github-repo", relations: { repo_writer: { this: {} } }, repo_reader: { ... } } }] } } }
```

#### Read All Namespaces Configuration

```javascript
const { data } = await sandcastleApi.sandcastleReadAllNamespaceConfigurations();

// data = { configurations: [{ id: "1uHxCSuTP0VKPYSnkq1pbb1jeZw", namespaces: { namespaces: [{ name: "github-repo", relations: {...} }, "github-team": { ... } ] } }] }
```

#### Check
> Provide a tuple and ask Sandcastle to check for a relationship

```javascript
const { data } = await sandcastleApi.sandcastleCheck({
  tupleKey: {
    user: "81684243-9356-4421-8fbf-a4f8d36aa31b",
    relation: "admin",
    object: "workspace:675bcac4-ad38-4fb1-a19a-94a5648c91d6",
  },
});

// data = { allowed: true, resolution: "", zookie: "" }

```

#### Write Tuples

```javascript
const { data } = await sandcastleApi.sandcastleWrite({
  writes: {
    tupleKeys: [{ user: "anne", relation: "repo_reader", object: "github-repo:auth0/express-jwt" }],
  },
});

// data = { zookie: "" }
```

#### Delete Tuples

```javascript
const { data } = await sandcastleApi.sandcastleWrite({
  deletes: {
    tupleKeys: [{ user: "anne", relation: "repo_reader", object: "github-repo:auth0/express-jwt" }],
  },
});

// data = { zookie: "" }
```

#### Expand

```javascript
const { data } = await sandcastleApi.sandcastleExpand({
  tupleKey: {
    relation: "admin",
    object: "workspace:675bcac4-ad38-4fb1-a19a-94a5648c91d6",
  },
});

// data = { tree: {...} }
```

#### Read

```javascript
const { data } = await sandcastleApi.sandcastleRead({
  reads: {
    tupleKeys: [
      {
        user: "anne",
        relation: "repo_reader",
        object: "github-repo:auth0/express-jwt",
      },
    ],
  },
});

// data = { tuples: [{ key: { user, relation, object }, timestamp: ... }], zookie: "" }
```

### API Endpoints

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**sandcastleCheck**](#sandcastlecheck) | **POST** /{storeId}/check |  |
| [**sandcastleDeleteTokenIssuer**](#sandcastledeletetokenissuer) | **DELETE** /{storeId}/settings/token-issuers/{id} |  |
| [**sandcastleExpand**](#sandcastleexpand) | **POST** /{storeId}/expand |  |
| [**sandcastleRead**](#sandcastleread) | **POST** /{storeId}/read |  |
| [**sandcastleReadAllNamespaceConfigurations**](#sandcastlereadallnamespaceconfigurations) | **GET** /{storeId}/namespace-configurations |  |
| [**sandcastleReadNamespaceConfiguration**](#sandcastlereadnamespaceconfiguration) | **GET** /{storeId}/namespace-configurations/{id} |  |
| [**sandcastleReadSettings**](#sandcastlereadsettings) | **GET** /{storeId}/settings |  |
| [**sandcastleReadTuples**](#sandcastlereadtuples) | **POST** /{storeId}/read-tuples | ReadTuples should only be used for the playground. do not enable it for prod deployments |
| [**sandcastleWrite**](#sandcastlewrite) | **POST** /{storeId}/write |  |
| [**sandcastleWriteNamespaceConfiguration**](#sandcastlewritenamespaceconfiguration) | **POST** /{storeId}/namespace-configurations |  |
| [**sandcastleWriteSettings**](#sandcastlewritesettings) | **PATCH** /{storeId}/settings |  |
| [**sandcastleWriteTokenIssuer**](#sandcastlewritetokenissuer) | **POST** /{storeId}/settings/token-issuers |  |

#### sandcastleCheck


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**SandcastleCheckRequestParams**](#SandcastleCheckRequestParams) |  | |

##### Return type

[**SandcastleCheckResponse**](#SandcastleCheckResponse)


#### sandcastleDeleteTokenIssuer


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string** |  | [default to undefined]|

##### Return type

**object**


#### sandcastleExpand


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**SandcastleExpandRequestParams**](#SandcastleExpandRequestParams) |  | |

##### Return type

[**SandcastleExpandResponse**](#SandcastleExpandResponse)


#### sandcastleRead


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**SandcastleReadRequestParams**](#SandcastleReadRequestParams) |  | |

##### Return type

[**SandcastleReadResponse**](#SandcastleReadResponse)


#### sandcastleReadAllNamespaceConfigurations


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |


##### Return type

[**SandcastleReadAllNamespaceConfigurationsResponse**](#SandcastleReadAllNamespaceConfigurationsResponse)


#### sandcastleReadNamespaceConfiguration


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string** |  | [default to undefined]|

##### Return type

[**SandcastleReadNamespaceConfigurationResponse**](#SandcastleReadNamespaceConfigurationResponse)


#### sandcastleReadSettings


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |


##### Return type

[**SettingsSettings**](#SettingsSettings)


#### sandcastleReadTuples


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**SandcastleReadTuplesRequest**](#SandcastleReadTuplesRequest) |  | |

##### Return type

[**SandcastleReadResponse**](#SandcastleReadResponse)


#### sandcastleWrite


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**SandcastleWriteRequestParams**](#SandcastleWriteRequestParams) |  | |

##### Return type

[**SandcastleWriteResponse**](#SandcastleWriteResponse)


#### sandcastleWriteNamespaceConfiguration


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**NamespaceNamespaces**](#NamespaceNamespaces) |  | |

##### Return type

[**SandcastleWriteNamespaceConfigurationResponse**](#SandcastleWriteNamespaceConfigurationResponse)


#### sandcastleWriteSettings


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**SandcastleWriteSettingsRequest**](#SandcastleWriteSettingsRequest) |  | |

##### Return type

[**SettingsSettings**](#SettingsSettings)


#### sandcastleWriteTokenIssuer


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | [**SandcastleWriteTokenIssuersRequest**](#SandcastleWriteTokenIssuersRequest) |  | |

##### Return type

[**SettingsTokenIssuer**](#SettingsTokenIssuer)


### Models

 - [NamespaceDifference](#NamespaceDifference)
 - [NamespaceNamespace](#NamespaceNamespace)
 - [NamespaceNamespaceConfiguration](#NamespaceNamespaceConfiguration)
 - [NamespaceNamespaces](#NamespaceNamespaces)
 - [NamespaceObjectRelation](#NamespaceObjectRelation)
 - [NamespaceTupleToUserset](#NamespaceTupleToUserset)
 - [NamespaceUserset](#NamespaceUserset)
 - [NamespaceUsersets](#NamespaceUsersets)
 - [ProtobufAny](#ProtobufAny)
 - [RpcStatus](#RpcStatus)
 - [SandcastleCheckRequestParams](#SandcastleCheckRequestParams)
 - [SandcastleCheckResponse](#SandcastleCheckResponse)
 - [SandcastleExpandRequestParams](#SandcastleExpandRequestParams)
 - [SandcastleExpandResponse](#SandcastleExpandResponse)
 - [SandcastleReadAllNamespaceConfigurationsResponse](#SandcastleReadAllNamespaceConfigurationsResponse)
 - [SandcastleReadNamespaceConfigurationResponse](#SandcastleReadNamespaceConfigurationResponse)
 - [SandcastleReadRequestParams](#SandcastleReadRequestParams)
 - [SandcastleReadResponse](#SandcastleReadResponse)
 - [SandcastleReadTuplesRequest](#SandcastleReadTuplesRequest)
 - [SandcastleTuple](#SandcastleTuple)
 - [SandcastleTupleKey](#SandcastleTupleKey)
 - [SandcastleTupleKeys](#SandcastleTupleKeys)
 - [SandcastleUsersetTree](#SandcastleUsersetTree)
 - [SandcastleUsersetTreeDifference](#SandcastleUsersetTreeDifference)
 - [SandcastleUsersetTreeTupleToUserset](#SandcastleUsersetTreeTupleToUserset)
 - [SandcastleWriteNamespaceConfigurationResponse](#SandcastleWriteNamespaceConfigurationResponse)
 - [SandcastleWriteRequestParams](#SandcastleWriteRequestParams)
 - [SandcastleWriteResponse](#SandcastleWriteResponse)
 - [SandcastleWriteSettingsRequest](#SandcastleWriteSettingsRequest)
 - [SandcastleWriteTokenIssuersRequest](#SandcastleWriteTokenIssuersRequest)
 - [SettingsEnvironment](#SettingsEnvironment)
 - [SettingsSettings](#SettingsSettings)
 - [SettingsTokenIssuer](#SettingsTokenIssuer)
 - [UsersetTreeComputed](#UsersetTreeComputed)
 - [UsersetTreeLeaf](#UsersetTreeLeaf)
 - [UsersetTreeNode](#UsersetTreeNode)
 - [UsersetTreeNodes](#UsersetTreeNodes)
 - [UsersetTreeUsers](#UsersetTreeUsers)


#### NamespaceDifference

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base** | [**NamespaceUserset**](#NamespaceUserset) |  | [optional] [default to undefined]
**subtract** | [**NamespaceUserset**](#NamespaceUserset) |  | [optional] [default to undefined]

#### NamespaceNamespace

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [optional] [default to undefined]
**relations** | [**Record<string, NamespaceUserset**>](#NamespaceUserset) |  | [optional] [default to undefined]

#### NamespaceNamespaceConfiguration

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**namespaces** | [**NamespaceNamespaces**](#NamespaceNamespaces) |  | [optional] [default to undefined]

#### NamespaceNamespaces

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**namespaces** | [**NamespaceNamespace**[]](#NamespaceNamespace) |  | [optional] [default to undefined]

#### NamespaceObjectRelation

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**object** | **string** |  | [optional] [default to undefined]
**relation** | **string** |  | [optional] [default to undefined]

#### NamespaceTupleToUserset

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tupleset** | [**NamespaceObjectRelation**](#NamespaceObjectRelation) |  | [optional] [default to undefined]
**computedUserset** | [**NamespaceObjectRelation**](#NamespaceObjectRelation) |  | [optional] [default to undefined]

#### NamespaceUserset

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**_this** | **object** | A DirectUserset is a sentinel message for referencing the direct members specified by an object/relation mapping. | [optional] [default to undefined]
**computedUserset** | [**NamespaceObjectRelation**](#NamespaceObjectRelation) |  | [optional] [default to undefined]
**tupleToUserset** | [**NamespaceTupleToUserset**](#NamespaceTupleToUserset) |  | [optional] [default to undefined]
**union** | [**NamespaceUsersets**](#NamespaceUsersets) |  | [optional] [default to undefined]
**intersection** | [**NamespaceUsersets**](#NamespaceUsersets) |  | [optional] [default to undefined]
**difference** | [**NamespaceDifference**](#NamespaceDifference) |  | [optional] [default to undefined]

#### NamespaceUsersets

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**child** | [**NamespaceUserset**[]](#NamespaceUserset) |  | [optional] [default to undefined]

#### ProtobufAny

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**typeUrl** | **string** |  | [optional] [default to undefined]
**value** | **string** |  | [optional] [default to undefined]

#### RpcStatus

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **number** |  | [optional] [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**details** | [**ProtobufAny**[]](#ProtobufAny) |  | [optional] [default to undefined]

#### SandcastleCheckRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tupleKey** | [**SandcastleTupleKey**](#SandcastleTupleKey) |  | [optional] [default to undefined]
**trace** | **boolean** | defaults to false. making it true has performance implications. only use for debugging purposes, etc. | [optional] [readonly] [default to undefined]
**zookie** | **string** |  | [optional] [readonly] [default to undefined]

#### SandcastleCheckResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**allowed** | **boolean** |  | [optional] [default to undefined]
**resolution** | **string** |  | [optional] [default to undefined]
**zookie** | **string** |  | [optional] [default to undefined]

#### SandcastleExpandRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tupleKey** | [**SandcastleTupleKey**](#SandcastleTupleKey) |  | [optional] [default to undefined]
**zookie** | **string** |  | [optional] [readonly] [default to undefined]

#### SandcastleExpandResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tree** | [**SandcastleUsersetTree**](#SandcastleUsersetTree) |  | [optional] [default to undefined]

#### SandcastleReadAllNamespaceConfigurationsResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**configurations** | [**NamespaceNamespaceConfiguration**[]](#NamespaceNamespaceConfiguration) |  | [optional] [default to undefined]

#### SandcastleReadNamespaceConfigurationResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**configuration** | [**NamespaceNamespaceConfiguration**](#NamespaceNamespaceConfiguration) |  | [optional] [default to undefined]

#### SandcastleReadRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reads** | [**SandcastleTupleKeys**](#SandcastleTupleKeys) |  | [optional] [default to undefined]
**zookie** | **string** |  | [optional] [readonly] [default to undefined]

#### SandcastleReadResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tuples** | [**SandcastleTuple**[]](#SandcastleTuple) |  | [optional] [default to undefined]
**zookie** | **string** |  | [optional] [default to undefined]

#### SandcastleReadTuplesRequest

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**storeId** | **string** |  | [optional] [default to undefined]

#### SandcastleTuple

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | [**SandcastleTupleKey**](#SandcastleTupleKey) |  | [optional] [default to undefined]
**timestamp** | **string** |  | [optional] [default to undefined]

#### SandcastleTupleKey

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**object** | **string** |  | [optional] [default to undefined]
**relation** | **string** |  | [optional] [default to undefined]
**user** | **string** |  | [optional] [default to undefined]

#### SandcastleTupleKeys

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tupleKeys** | [**SandcastleTupleKey**[]](#SandcastleTupleKey) |  | [optional] [default to undefined]

#### SandcastleUsersetTree

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**root** | [**UsersetTreeNode**](#UsersetTreeNode) |  | [optional] [default to undefined]

#### SandcastleUsersetTreeDifference

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base** | [**UsersetTreeNode**](#UsersetTreeNode) |  | [optional] [default to undefined]
**subtract** | [**UsersetTreeNode**](#UsersetTreeNode) |  | [optional] [default to undefined]

#### SandcastleUsersetTreeTupleToUserset

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tupleset** | **string** |  | [optional] [default to undefined]
**computed** | [**UsersetTreeComputed**[]](#UsersetTreeComputed) |  | [optional] [default to undefined]

#### SandcastleWriteNamespaceConfigurationResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**zookie** | **string** |  | [optional] [default to undefined]

#### SandcastleWriteRequestParams

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**writes** | [**SandcastleTupleKeys**](#SandcastleTupleKeys) |  | [optional] [default to undefined]
**deletes** | [**SandcastleTupleKeys**](#SandcastleTupleKeys) |  | [optional] [default to undefined]
**lockTuple** | [**SandcastleTuple**](#SandcastleTuple) |  | [optional] [default to undefined]

#### SandcastleWriteResponse

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**zookie** | **string** |  | [optional] [default to undefined]

#### SandcastleWriteSettingsRequest

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**storeId** | **string** |  | [optional] [default to undefined]
**environment** | [**SettingsEnvironment**](#SettingsEnvironment) |  | [optional] [default to undefined]

#### SandcastleWriteTokenIssuersRequest

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**storeId** | **string** |  | [optional] [default to undefined]
**issuerUrl** | **string** |  | [optional] [default to undefined]

#### SettingsEnvironment

##### Enum


* `EnvironmentUnspecified` (value: `'ENVIRONMENT_UNSPECIFIED'`)

* `Development` (value: `'DEVELOPMENT'`)

* `Staging` (value: `'STAGING'`)

* `Production` (value: `'PRODUCTION'`)


#### SettingsSettings

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**environment** | [**SettingsEnvironment**](#SettingsEnvironment) |  | [optional] [default to undefined]
**tokenIssuers** | [**SettingsTokenIssuer**[]](#SettingsTokenIssuer) |  | [optional] [default to undefined]

#### SettingsTokenIssuer

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**issuerUrl** | **string** |  | [optional] [default to undefined]

#### UsersetTreeComputed

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userset** | **string** |  | [optional] [default to undefined]

#### UsersetTreeLeaf

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**users** | [**UsersetTreeUsers**](#UsersetTreeUsers) |  | [optional] [default to undefined]
**computed** | [**UsersetTreeComputed**](#UsersetTreeComputed) |  | [optional] [default to undefined]
**tupleToUserset** | [**SandcastleUsersetTreeTupleToUserset**](#SandcastleUsersetTreeTupleToUserset) |  | [optional] [default to undefined]

#### UsersetTreeNode

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [optional] [default to undefined]
**leaf** | [**UsersetTreeLeaf**](#UsersetTreeLeaf) |  | [optional] [default to undefined]
**difference** | [**SandcastleUsersetTreeDifference**](#SandcastleUsersetTreeDifference) |  | [optional] [default to undefined]
**union** | [**UsersetTreeNodes**](#UsersetTreeNodes) |  | [optional] [default to undefined]
**intersection** | [**UsersetTreeNodes**](#UsersetTreeNodes) |  | [optional] [default to undefined]

#### UsersetTreeNodes

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**nodes** | [**UsersetTreeNode**[]](#UsersetTreeNode) |  | [optional] [default to undefined]

#### UsersetTreeUsers

##### Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**users** | **string** |  | [optional] [default to undefined]



## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository [issues](https://github.com/auth0-lab/sandcastle-js-sdk/issues) section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

For auth0 related questions/support please use the [Support Center](https://support.auth0.com).

## Author

[Auth0Lab](https://github.com/auth0-lab)

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/auth0-lab/sandcastle-js-sdk/blob/main/LICENSE) file for more info.

The code in this repo was auto generated by [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator) from a template based on the [typescript-axios template](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/typescript-axios) and [go template](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/go), licensed under the [Apache License 2.0](https://github.com/OpenAPITools/openapi-generator/blob/master/LICENSE).
