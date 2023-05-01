import {
  ClientConfiguration as OpenFgaClientConfiguration,
  Configuration as OpenFgaConfiguration,
  ClientRequestOpts,
  ClientRequestOptsWithAuthZModelId,
  CreateStoreRequest,
  CreateStoreResponse,
  FgaError,
  GetStoreResponse,
  ListStoresResponse,
  OpenFgaClient,
  PaginationOptions,
} from "@openfga/sdk";
import { PromiseResult } from "@openfga/sdk/dist/common";
import { AxiosInstance, AxiosStatic } from "axios";
import { Configuration, UserConfigurationParams } from "./configuration";

export class UnimplementedError extends FgaError {}

export class ClientConfiguration extends Configuration {
  public authorizationModelId?: string;
  constructor(configuration: UserConfigurationParams & { authorizationModelId?: string }, axios?: AxiosInstance) {
    super(configuration);
    this.authorizationModelId = configuration.authorizationModelId;
  }
}

export class Auth0FgaClient extends OpenFgaClient {
  constructor(configuration: ClientConfiguration | UserConfigurationParams & { authorizationModelId?: string }, axios?: AxiosStatic | undefined) {
    let config;
    if (configuration instanceof ClientConfiguration || configuration instanceof Configuration) {
      config = configuration;
    } else {
      config = new ClientConfiguration(configuration, axios);
    }
    config.isValid();
    super(config);

    this.authorizationModelId = config.authorizationModelId;
  }

  public async listStores(options?: ClientRequestOpts & PaginationOptions): PromiseResult<ListStoresResponse> {
    throw new UnimplementedError("Auth0 FGA API does not support Store methods");
  }

  public async createStore(body: CreateStoreRequest, options?: ClientRequestOpts): PromiseResult<CreateStoreResponse> {
    throw new UnimplementedError("Auth0 FGA API does not support Store methods");
  }

  public async getStore(options?: ClientRequestOpts): PromiseResult<GetStoreResponse> {
    throw new UnimplementedError("Auth0 FGA API does not support Store methods");
  }

  public async deleteStore(options?: ClientRequestOpts): PromiseResult<void> {
    throw new UnimplementedError("Auth0 FGA API does not support Store methods");
  }
}
