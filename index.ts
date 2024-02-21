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

export * from "./api";
export * from "./client";
export * from "./configuration";
export * from "./errors";
export * from "./constants";

export { OpenFgaClient, OpenFgaApi } from "@openfga/sdk";
export {
  ClientRequestOptsWithAuthZModelId,
  PaginationOptions,
  ClientCheckRequest,
  ClientBatchCheckRequest,
  ClientBatchCheckSingleResponse,
  ClientExpandRequest,
  ClientReadRequest,
  ClientListObjectsRequest,
  ClientListRelationsRequest,
  ClientWriteAssertionsRequest,
  ClientRequestOpts,
  AuthorizationModelIdOpts,
  ClientBatchCheckResponse,
  ClientWriteRequestOpts,
  BatchCheckRequestOpts,
  ClientWriteRequest,
  ClientWriteSingleResponse,
  ClientWriteResponse,
  ClientListRelationsResponse,
  ClientReadChangesRequest,
} from "@openfga/sdk/dist/client";
export * from "@openfga/sdk/dist/apiModel";
