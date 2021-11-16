# Changelog

## [0.3.1](https://github.com/auth0-lab/sandcastle-js-sdk/compare/v0.3.0...v0.3.1) (2021-11-16)

## Changes:
- feat: add support for the `poc` environment 87c3da3

## [0.3.0](https://github.com/auth0-lab/sandcastle-js-sdk/compare/v0.2.0...v0.3.0) (2021-11-12)

Note: Previous versions of the SDK will no longer work with the API

## Changes:
- feat!: rename namespaces configurations ac357c1
    * `namespaces` are now `types`
    * `/namespace-configurations` endpoint is now `/authorization-models`
    * Some methods were renamed:
      * `readNamespaceConfigurations` is now `readAuthzModels`
      * `readNamespaceConfiguration` is now `readAuthzModel`
      * `writeNamespaceConfiguration` is now `writeAuthzModel`

- feat!: support pagination 64782e2
    * Some methods now support passing `authorization_model_id` to run against a specific version of the model
      * This is supported by the `read`, `write`, `expand` and `check` methods
    * `readNamespaceConfigurations` allows passing in `pageSize` and `continuationToken` for pagination
    * rename `readAllNamespaceConfigurations` to `readNamespaceConfigurations`

## [0.2.0](https://github.com/auth0-lab/sandcastle-js-sdk/compare/v0.1.2...v0.2.0) (2021-10-04)

## Changes:
- feat!: drop zookies, lowercase params & update exported methods 26453ae
    * drop references to Zookies
    * lowercase all parameters
      * in `check` and `expand` requests, `tupleKey` becomes `tuple_key`
      * in `write` and `read` requests `tupleKeys` becomes `tuple_keys`
    * remove `sandcastle` prefixes on methods (`sandcastleCheck` becomes `check`)
    * the methods now return the response body directly

- feat!: require passing `storeId` instead of `tenant` 874dbbb

## [0.1.2](https://github.com/auth0-lab/sandcastle-js-sdk/compare/v0.1.1...v0.1.2) (2021-09-28)

## Changes:
- fix: update endpoint paths, remove `/v1` 768960d
- fix: regenerate sdk from latest API definition 730bd1f

## [0.1.1](https://github.com/auth0-lab/sandcastle-js-sdk/compare/v0.1.1...v0.1.0) (2021-09-24)

## Changes:
- feat: rename `tenant` to `store`

## [0.1.0](https://github.com/auth0-lab/sandcastle-js-sdk/compare/v0.1.0...v0.0.4) (2021-09-13)

## Changes:
- feat: require specifying environment when initializing the SDK [BREAKING CHANGE] [b9de85e](https://github.com/auth0-lab/sandcastle-js-sdk/commit/b9de85e)

## Security:
- deps: bump axios to 0.21.4 to fix CVE-2021-3749 [c3eeccd](https://github.com/auth0-lab/sandcastle-js-sdk/commit/c3eeccd)

## [0.0.4](https://github.com/auth0-lab/sandcastle-js-sdk/compare/v0.0.3...v0.0.4) (2021-07-28)

## Changes:
- feat: allow specifying the sandcastle deployment id [688e95e](https://github.com/auth0-lab/sandcastle-js-sdk/commit/688e95e)

## [0.0.3](https://github.com/auth0-lab/sandcastle-js-sdk/compare/v0.0.2...v0.0.3) (2021-07-22)

## Changes:
- docs: remove package version from readme [72ac7e0](https://github.com/auth0-lab/sandcastle-js-sdk/commit/72ac7e0)

## [0.0.2](https://github.com/auth0-lab/sandcastle-js-sdk/compare/v0.0.1...v0.0.2) (2021-07-22)

First public release

## Changes:
- chore: update readme [fb42c82](https://github.com/auth0-lab/sandcastle-js-sdk/commit/fb42c82)
- feat: add sdk [9d7ebcc](https://github.com/auth0-lab/sandcastle-js-sdk/commit/9d7ebcc)

## 0.0.1

Internal Release
