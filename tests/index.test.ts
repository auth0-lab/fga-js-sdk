import * as nock from "nock";

import {
  Auth0FgaApi,
  Auth0FgaApiInternalError,
  Auth0FgaApiNotFoundError,
  Auth0FgaApiRateLimitExceededError,
  Auth0FgaApiValidationError,
  Auth0FgaAuthenticationError,
  AuthorizationModel,
  CheckResponse,
  Configuration,
  ErrorCode,
  ExpandResponse,
  ReadAuthorizationModelResponse,
  ReadAuthorizationModelsResponse,
  ReadResponse,
  TupleKey,
  TypeDefinitions,
} from "../";
import { CallResult } from "../common";
import { GetDefaultRetryParams } from "../configuration";

nock.disableNetConnect();

const {
  AUTH0_FGA_ENVIRONMENT,
  AUTH0_FGA_STORE_ID,
  AUTH0_FGA_CLIENT_ID,
  AUTH0_FGA_CLIENT_SECRET,
} = process.env as {
  AUTH0_FGA_ENVIRONMENT: string;
  AUTH0_FGA_STORE_ID: string;
  AUTH0_FGA_CLIENT_ID: string;
  AUTH0_FGA_CLIENT_SECRET: string;
} & Record<string, string>;

const baseConfig = {
  storeId: AUTH0_FGA_STORE_ID,
  environment: AUTH0_FGA_ENVIRONMENT,
  clientId: AUTH0_FGA_CLIENT_ID,
  clientSecret: AUTH0_FGA_CLIENT_SECRET,
};

const defaultConfiguration = new Configuration(baseConfig);

const nocks = {
  tokenExchange: (
    apiTokenIssuer: string,
    accessToken = "access-token",
    expiresIn = 300
  ) => {
    return nock(`https://${apiTokenIssuer}`).post("/oauth/token").reply(200, {
      access_token: accessToken,
      expires_in: expiresIn,
    });
  },
  readAuthorizationModels: (
    storeId: string,
    serverUrl = defaultConfiguration.serverUrl
  ) => {
    return nock(serverUrl)
      .get(`/stores/${storeId}/authorization-models`)
      .reply(200, {
        configurations: [],
      } as ReadAuthorizationModelsResponse);
  },
  check: (
    storeId: string,
    tuple: TupleKey,
    serverUrl = defaultConfiguration.serverUrl
  ) => {
    return nock(serverUrl)
      .post(`/stores/${storeId}/check`)
      .reply(200, {
        allowed: true,
      } as CheckResponse);
  },
  write: (
    storeId: string,
    tuple: TupleKey,
    serverUrl = defaultConfiguration.serverUrl
  ) => {
    return nock(serverUrl)
      .post(`/stores/${storeId}/write`)
      .reply(200, {} as Promise<object>);
  },
  delete: (
    storeId: string,
    tuple: TupleKey,
    serverUrl = defaultConfiguration.serverUrl
  ) => {
    return nock(serverUrl)
      .post(`/stores/${storeId}/write`)
      .reply(200, {} as Promise<object>);
  },
  read: (
    storeId: string,
    tuple: TupleKey,
    serverUrl = defaultConfiguration.serverUrl
  ) => {
    return nock(serverUrl)
      .post(`/stores/${storeId}/read`)
      .reply(200, { tuples: [] } as ReadResponse);
  },
  expand: (
    storeId: string,
    tuple: TupleKey,
    serverUrl = defaultConfiguration.serverUrl
  ) => {
    return nock(serverUrl)
      .post(`/stores/${storeId}/expand`)
      .reply(200, { tree: {} } as ExpandResponse);
  },
  readSingleAuthzModel: (
    storeId: string,
    configId: string,
    serverUrl = defaultConfiguration.serverUrl
  ) => {
    return nock(serverUrl)
      .get(`/stores/${storeId}/authorization-models/${configId}`)
      .reply(200, {
        configuration: { id: "some-id", type_definitions: [] },
      } as AuthorizationModel);
  },
  writeAuthorizationModel: (
    storeId: string,
    configurations: TypeDefinitions,
    serverUrl = defaultConfiguration.serverUrl
  ) => {
    return nock(serverUrl)
      .post(`/stores/${storeId}/authorization-models`)
      .reply(200, {
        id: "some-new-id",
      } as ReadAuthorizationModelResponse);
  },
};

describe("auth0-fga-sdk", function () {
  describe("initializing the sdk", () => {
    it("should require storeId in configuration", () => {
      expect(
        () => new Auth0FgaApi({ ...baseConfig, storeId: undefined! })
      ).toThrowError();
    });

    it("should allow not passing in an environment in configuration", () => {
      expect(
        () => new Auth0FgaApi({ ...baseConfig, environment: undefined! })
      ).not.toThrowError();
    });

    it("should require a valid environment in configuration", () => {
      expect(
        () =>
          new Auth0FgaApi({
            ...baseConfig,
            environment: "non_existent_environment"!,
          })
      ).toThrowError();
    });

    it("should not require clientId or clientSecret in configuration in environments that don't require it", () => {
      expect(
        () =>
          new Auth0FgaApi({
            storeId: AUTH0_FGA_STORE_ID,
            environment: "playground",
            clientId: undefined!,
            clientSecret: undefined!,
          })
      ).not.toThrowError();
    });

    it("should require clientId or clientSecret in configuration in environments that require it", () => {
      expect(
        () =>
          new Auth0FgaApi({
            storeId: AUTH0_FGA_STORE_ID,
            environment: "staging",
            clientId: undefined!,
            clientSecret: undefined!,
          })
      ).toThrowError();
    });

    it("should issue a network call to get the token at the first request if client id is provided", async () => {
      const scope = nocks.tokenExchange(defaultConfiguration.apiTokenIssuer!);
      nocks.readAuthorizationModels(AUTH0_FGA_STORE_ID);

      const auth0FgaApi = new Auth0FgaApi(baseConfig);
      expect(scope.isDone()).toBe(false);

      await auth0FgaApi.readAuthorizationModels();

      expect(scope.isDone()).toBe(true);

      nock.cleanAll();
    });

    it("should not issue a network call to get the token at the first request if the clientId is not provided", async () => {
      const scope = nocks.tokenExchange(defaultConfiguration.apiTokenIssuer!);
      nocks.readAuthorizationModels(AUTH0_FGA_STORE_ID);

      const auth0FgaApi = new Auth0FgaApi({
        storeId: AUTH0_FGA_STORE_ID,
        environment: "playground",
        clientId: undefined!,
        clientSecret: undefined!,
      });
      expect(scope.isDone()).toBe(false);

      await auth0FgaApi.readAuthorizationModels();

      expect(scope.isDone()).toBe(false);

      nock.cleanAll();
    });

    it("should allow passing in a configuration instance", async () => {
      const configuration = new Configuration(baseConfig);
      configuration.apiAudience = "api.fga.auth0.example";
      expect(() => new Auth0FgaApi(configuration)).not.toThrowError();
    });
  });

  describe("error handling", () => {
    let auth0FgaApi: Auth0FgaApi;
    const { storeId } = baseConfig;
    const { serverUrl } = defaultConfiguration;
    const requestId = "1F2A3B";

    beforeAll(() => {
      auth0FgaApi = new Auth0FgaApi({ ...baseConfig });
    });

    describe("400 level error should result in Auth0FgaApiValidationError", () => {
      const tupleKey = {
        object: "foobar:x",
        user: "user:xyz",
      };

      beforeAll(async () => {
        nock(`https://${defaultConfiguration.apiTokenIssuer}`)
          .post("/oauth/token")
          .times(2)
          .reply(200, {
            access_token: "test-token",
          });

        nock(serverUrl)
          .defaultReplyHeaders({
            "Fga-Request-Id": requestId,
            "Content-Type": "application/json",
          })
          .post(
            `/stores/${storeId}/check`,
            {
              tuple_key: tupleKey,
            },
            expect.objectContaining({ Authorization: "Bearer test-token" })
          )
          .times(2)
          .reply(400, {
            code: "validation_error",
            message: "nock error",
          });
      });

      it("should throw Auth0FgaApiValidationError", async () => {
        await expect(
          auth0FgaApi.check({ tuple_key: tupleKey })
        ).rejects.toThrow(Auth0FgaApiValidationError);
      });

      it("Auth0FgaApiValidationError should have correct fields", async () => {
        // we will examine the field in error
        try {
          await auth0FgaApi.check({ tuple_key: tupleKey });
        } catch (err) {
          expect(err).toBeInstanceOf(Auth0FgaApiValidationError);
          if (err instanceof Auth0FgaApiValidationError) {
            expect(err.apiErrorCode).toBe(ErrorCode.ValidationError);
            expect(err.storeId).toBe(storeId);
            expect(err.endpointCategory).toBe("check");
            expect(err.requestId).toBe(requestId);
          }
        }
      });
    });

    describe("429 level error should result in Auth0FgaApiRateLimitExceededError", () => {
      const tupleKey = {
        object: "foobar:x",
        user: "user:xyz",
      };

      beforeAll(async () => {
        const updateBaseConfig = {
          storeId: AUTH0_FGA_STORE_ID,
          environment: AUTH0_FGA_ENVIRONMENT,
          clientId: AUTH0_FGA_CLIENT_ID,
          clientSecret: AUTH0_FGA_CLIENT_SECRET,
          retryParams: GetDefaultRetryParams(2, 10),
        };
        auth0FgaApi = new Auth0FgaApi({ ...updateBaseConfig });
        nock(`https://${defaultConfiguration.apiTokenIssuer}`)
          .post("/oauth/token")
          .reply(200, {
            access_token: "test-token",
          });

        nock(serverUrl)
          .post(
            `/stores/${storeId}/check`,
            {
              tuple_key: tupleKey,
            },
            expect.objectContaining({ Authorization: "Bearer test-token" })
          )
          .times(3)
          .reply(429, {
            code: "rate_limit_exceeded",
            message: "nock error",
          });
      });
      it("should throw Auth0FgaApiRateLimitExceededError", async () => {
        await expect(
          auth0FgaApi.check({ tuple_key: tupleKey }, {})
        ).rejects.toThrow(Auth0FgaApiRateLimitExceededError);
      });
    });

    describe("429 with retry in config and retry is successful", () => {
      const tupleKey = {
        object: "foobar:x",
        user: "user:xyz",
      };

      beforeAll(async () => {
        const updateBaseConfig = {
          storeId: AUTH0_FGA_STORE_ID,
          environment: AUTH0_FGA_ENVIRONMENT,
          clientId: AUTH0_FGA_CLIENT_ID,
          clientSecret: AUTH0_FGA_CLIENT_SECRET,
          retryParams: GetDefaultRetryParams(2, 10),
        };
        auth0FgaApi = new Auth0FgaApi({ ...updateBaseConfig });

        nock(`https://${defaultConfiguration.apiTokenIssuer}`)
          .post("/oauth/token")
          .reply(200, {
            access_token: "test-token",
          });

        nock(serverUrl)
          .post(
            `/stores/${storeId}/check`,
            {
              tuple_key: tupleKey,
            },
            expect.objectContaining({ Authorization: "Bearer test-token" })
          )
          .times(1)
          .reply(429, {
            code: "rate_limit_exceeded",
            message: "nock error",
          });

        nocks.check(AUTH0_FGA_STORE_ID, tupleKey);
      });
      it("should return allowed", async () => {
        const result = await auth0FgaApi.check({ tuple_key: tupleKey }, {});

        expect(result.allowed).toBe(true);
      });
    });

    describe("429 with retry in call and retry is successful", () => {
      const tupleKey = {
        object: "foobar:x",
        user: "user:xyz",
      };

      beforeAll(async () => {
        nock(`https://${defaultConfiguration.apiTokenIssuer}`)
          .post("/oauth/token")
          .reply(200, {
            access_token: "test-token",
          });

        nock(serverUrl)
          .post(
            `/stores/${storeId}/check`,
            {
              tuple_key: tupleKey,
            },
            expect.objectContaining({ Authorization: "Bearer test-token" })
          )
          .times(1)
          .reply(429, {
            code: "rate_limit_exceeded",
            message: "nock error",
          });

        nocks.check(AUTH0_FGA_STORE_ID, tupleKey);
      });
      it("should return allowed", async () => {
        const result = await auth0FgaApi.check(
          { tuple_key: tupleKey },
          { retryParams: GetDefaultRetryParams(2, 10) }
        );

        expect(result.allowed).toBe(true);
      });
    });

    describe("500 level error should result in Auth0FgaApiInternalError", () => {
      const tupleKey = {
        object: "foobar:x",
        user: "user:xyz",
      };

      beforeAll(async () => {
        nock(`https://${defaultConfiguration.apiTokenIssuer}`)
          .post("/oauth/token")
          .reply(200, {
            access_token: "test-token",
          });

        nock(serverUrl)
          .post(
            `/stores/${storeId}/check`,
            {
              tuple_key: tupleKey,
            },
            expect.objectContaining({ Authorization: "Bearer test-token" })
          )
          .reply(500, {
            code: "internal_error",
            message: "nock error",
          });
      });
      it("should throw Auth0FgaApiInternalError", async () => {
        await expect(
          auth0FgaApi.check({ tuple_key: tupleKey })
        ).rejects.toThrow(Auth0FgaApiInternalError);
      });
    });

    describe("404 level error should result in Auth0FgaApiNotFoundError", () => {
      const tupleKey = {
        object: "foobar:x",
        user: "user:xyz",
      };

      beforeAll(async () => {
        nock(`https://${defaultConfiguration.apiTokenIssuer}`)
          .post("/oauth/token")
          .reply(200, {
            access_token: "test-token",
          });

        nock(serverUrl)
          .post(
            `/stores/${storeId}/check`,
            {
              tuple_key: tupleKey,
            },
            expect.objectContaining({ Authorization: "Bearer test-token" })
          )
          .reply(404, {
            code: "undefined_endpoint",
            message: "nock error",
          });
      });
      it("should throw Auth0FgaApiNotFoundError", async () => {
        await expect(
          auth0FgaApi.check({ tuple_key: tupleKey })
        ).rejects.toThrow(Auth0FgaApiNotFoundError);
      });
    });

    describe("401 during authentication should result in Auth0FgaAuthenticationError", () => {
      const tupleKey = {
        object: "foobar:x",
        user: "user:xyz",
      };

      beforeAll(async () => {
        nock(`https://${defaultConfiguration.apiTokenIssuer}`)
          .post("/oauth/token")
          .reply(401, {
            access_token: "test-token",
          });

        nock(serverUrl)
          .post(
            `/stores/${storeId}/check`,
            {
              tuple_key: tupleKey,
            },
            expect.objectContaining({ Authorization: "Bearer test-token" })
          )
          .reply(500, {
            code: "invalid_claims",
            message: "nock error",
          });
      });
      it("should throw Auth0FgaAuthenticationError", async () => {
        await expect(
          auth0FgaApi.check({ tuple_key: tupleKey })
        ).rejects.toThrow(Auth0FgaAuthenticationError);
      });
    });
  });

  describe("happy path of CHECK", () => {
    let result: CallResult<CheckResponse>;
    let auth0FgaApi: Auth0FgaApi;

    beforeAll(async () => {
      auth0FgaApi = new Auth0FgaApi({ ...baseConfig });
      nocks.tokenExchange(defaultConfiguration.apiTokenIssuer!);

      const tupleKey = {
        object: "foobar:x",
        user: "user:xyz",
        relation: "abc",
      };
      const scope = nocks.check(AUTH0_FGA_STORE_ID, tupleKey);
      expect(scope.isDone()).toBe(false);

      result = await auth0FgaApi.check({ tuple_key: tupleKey });
      expect(scope.isDone()).toBe(true);

      nock.cleanAll();
    });

    it("should return allowed", () => {
      expect(result.allowed).toBe(true);
    });

    it("should return the proper $response object", () => {
      expect(result).toHaveProperty("$response");
      expect(result.$response.status).toBe(200);
      expect(
        Object.prototype.propertyIsEnumerable.call(result, "$response")
      ).toBe(false);
    });
  });

  describe("using the sdk", () => {
    let auth0FgaApi: Auth0FgaApi;

    beforeAll(() => {
      auth0FgaApi = new Auth0FgaApi({ ...baseConfig });
    });

    beforeEach(() => {
      nocks.tokenExchange(defaultConfiguration.apiTokenIssuer!);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    describe("check", () => {
      it("should properly pass the request and return an allowed API response", async () => {
        const tuple = {
          user: "user543",
          relation: "admin",
          object: "workspace:1",
        };
        const scope = nocks.check(AUTH0_FGA_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await auth0FgaApi.check({ tuple_key: tuple });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ allowed: expect.any(Boolean) });
      });
    });

    describe("write: write tuples", () => {
      it("should properly pass the errors that the Auth0 FGA API returns", async () => {
        const tuple = {
          user: "user543",
          relation: "admin",
          object: "workspace:1",
        };
        const scope = nocks.write(AUTH0_FGA_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await auth0FgaApi.write({
          writes: { tuple_keys: [tuple] },
        });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe("write: delete tuples", () => {
      it("should properly pass the errors that the Auth0 FGA API returns", async () => {
        const tuple = {
          user: "user543",
          relation: "admin",
          object: "workspace:1",
        };
        const scope = nocks.delete(AUTH0_FGA_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await auth0FgaApi.write({
          deletes: { tuple_keys: [tuple] },
        });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe("expand", () => {
      it("should properly pass the errors that the Auth0 FGA API returns", async () => {
        const tuple = {
          user: "user543",
          relation: "admin",
          object: "workspace:1",
        };
        const scope = nocks.expand(AUTH0_FGA_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await auth0FgaApi.expand({ tuple_key: tuple });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe("read", () => {
      it("should properly pass the errors that the Auth0 FGA API returns", async () => {
        const tuple = {
          user: "user543",
          relation: "admin",
          object: "workspace:1",
        };
        const scope = nocks.read(AUTH0_FGA_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await auth0FgaApi.read({ tuple_key: tuple });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe("writeAuthorizationModel", () => {
      it("should call the api and return the response", async () => {
        const authorizationModel = {
          type_definitions: [
            { type: "workspace", relations: { admin: { this: {} } } },
          ],
        };
        const scope = nocks.writeAuthorizationModel(
          AUTH0_FGA_STORE_ID,
          authorizationModel
        );

        expect(scope.isDone()).toBe(false);
        const data = await auth0FgaApi.writeAuthorizationModel(
          authorizationModel
        );

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ id: expect.any(String) });
      });
    });

    describe("readAuthorizationModel", () => {
      it("should call the api and return the response", async () => {
        const configId = "string";
        const scope = nocks.readSingleAuthzModel(AUTH0_FGA_STORE_ID, configId);

        expect(scope.isDone()).toBe(false);
        const data = await auth0FgaApi.readAuthorizationModel(configId);

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({
          configuration: {
            id: expect.any(String),
            type_definitions: expect.arrayContaining([]),
          },
        });
      });
    });

    describe("readAuthorizationModels", () => {
      it("should call the api and return the response", async () => {
        const scope = nocks.readAuthorizationModels(AUTH0_FGA_STORE_ID);

        expect(scope.isDone()).toBe(false);
        const data = await auth0FgaApi.readAuthorizationModels();

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({
          configurations: expect.arrayContaining([]),
        });
      });
    });
  });
});
