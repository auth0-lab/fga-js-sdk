import * as nock from 'nock';

import { NamespaceNamespaces, SandcastleApi, SandcastleTupleKey } from "../api";
import { Configuration } from "../configuration";

nock.disableNetConnect();

const { SANDCASTLE_ENVIRONMENT, SANDCASTLE_STORE_ID, SANDCASTLE_CLIENT_ID, SANDCASTLE_CLIENT_SECRET } = process.env as {
  SANDCASTLE_ENVIRONMENT: string; SANDCASTLE_STORE_ID: string; SANDCASTLE_CLIENT_ID: string; SANDCASTLE_CLIENT_SECRET: string;
} & any;

const baseConfig = {
  storeId: SANDCASTLE_STORE_ID,
  environment: SANDCASTLE_ENVIRONMENT,
  clientId: SANDCASTLE_CLIENT_ID,
  clientSecret: SANDCASTLE_CLIENT_SECRET,
};

const defaultConfiguration = new Configuration(baseConfig);

const nocks = {
  tokenExchange: (apiTokenIssuer: string, accessToken = 'access-token', expiresIn = 300) => {
    return nock(`https://${apiTokenIssuer}`)
      .post('/oauth/token')
      .reply(200, {
        access_token: accessToken,
        expires_in: expiresIn,
      });
  },
  readAllNssConfigs: (storeId: string, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .get(`/${storeId}/namespace-configurations`)
      .reply(200, {
        configurations: [],
      })
  },
  check: (storeId: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${storeId}/check`)
      .reply(200, {
        allowed: true,
      });
  },
  write: (storeId: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${storeId}/write`)
      .reply(200, {});
  },
  delete: (storeId: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${storeId}/write`)
      .reply(200, {});
  },
  read: (storeId: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${storeId}/read`)
      .reply(200, { tuples: [] });
  },
  expand: (storeId: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${storeId}/expand`)
      .reply(200, { tree: {} });
  },
  readSingleNssConfig: (storeId: string, configId: string, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .get(`/${storeId}/namespace-configurations/${configId}`)
      .reply(200, {
        configuration: { id: "some-id", namespaces: [] },
      });
  },
  upsertNssConfig: (storeId: string, configurations: NamespaceNamespaces, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${storeId}/namespace-configurations`)
      .reply(200, {
        id: "some-new-id",
      });
  }
}

describe('sandcastle-sdk', function () {
  describe('initializing the sdk', () => {
    it('should require storeId in configuration', () => {
      expect(() => new SandcastleApi({ ...baseConfig, storeId: undefined! })).toThrowError();
    });

    it('should require environment in configuration', () => {
      expect(() => new SandcastleApi({ ...baseConfig, environment: undefined! })).toThrowError();
    });

    it('should require a valid environment in configuration', () => {
      expect(() => new SandcastleApi({ ...baseConfig, environment: 'non_existent_environment'! })).toThrowError();
    });

    it('should not require clientId or clientSecret in configuration in environments that don\'t require it', () => {
      expect(() => new SandcastleApi({ storeId: SANDCASTLE_STORE_ID, environment: 'playground', clientId: undefined!, clientSecret: undefined! })).not.toThrowError();
    });

    it('should require clientId or clientSecret in configuration in environments that require it', () => {
      expect(() => new SandcastleApi({ storeId: SANDCASTLE_STORE_ID, environment: 'staging', clientId: undefined!, clientSecret: undefined! })).toThrowError();
    });

    it('should issue a network call to get the token at the first request if client id is provided', async () => {
      const scope = nocks.tokenExchange(defaultConfiguration.apiTokenIssuer!);
      nocks.readAllNssConfigs(SANDCASTLE_STORE_ID);

      const sandcastleApi = new SandcastleApi(baseConfig);
      expect(scope.isDone()).toBe(false);

      await sandcastleApi.readAllNamespaceConfigurations();

      expect(scope.isDone()).toBe(true);

      nock.cleanAll();
    })

    it('should not issue a network call to get the token at the first request if the clientId is not provided', async () => {
      const scope = nocks.tokenExchange(defaultConfiguration.apiTokenIssuer!);
      nocks.readAllNssConfigs(SANDCASTLE_STORE_ID);

      const sandcastleApi = new SandcastleApi({ storeId: SANDCASTLE_STORE_ID, environment: 'playground', clientId: undefined!, clientSecret: undefined! });
      expect(scope.isDone()).toBe(false);

      await sandcastleApi.readAllNamespaceConfigurations();

      expect(scope.isDone()).toBe(false);

      nock.cleanAll();
    })

    it('should allow passing in a configuration instance', async () => {
      const configuration = new Configuration(baseConfig);
      configuration.apiAudience = 'api.playground.sandcastle.example';
      expect(() => new SandcastleApi(configuration)).not.toThrowError();
    });
  });

  describe('using the sdk', () => {
    let sandcastleApi: SandcastleApi;

    beforeAll(() => {
      sandcastleApi = new SandcastleApi({ ...baseConfig });
    });

    beforeEach(() => {
      nocks.tokenExchange(defaultConfiguration.apiTokenIssuer!);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    describe('check', () => {
      it('should properly pass the request and return an allowed API response', async () => {
        const tuple = { user: 'user543', relation: 'admin', object: 'workspace:1' };
        const scope = nocks.check(SANDCASTLE_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await sandcastleApi.check({ tuple_key: tuple });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ allowed: expect.any(Boolean) });
      });
    });

    describe('write: write tuples', () => {
      it('should properly pass the errors that the sandcastle api returns', async () => {
        const tuple = { user: 'user543', relation: 'admin', object: 'workspace:1' };
        const scope = nocks.write(SANDCASTLE_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await sandcastleApi.write({ writes: { tuple_keys: [tuple] } });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe('write: delete tuples', () => {
      it('should properly pass the errors that the sandcastle api returns', async () => {
        const tuple = { user: 'user543', relation: 'admin', object: 'workspace:1' };
        const scope = nocks.delete(SANDCASTLE_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await sandcastleApi.write({ deletes: { tuple_keys: [tuple] } });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe('expand', () => {
      it('should properly pass the errors that the sandcastle api returns', async () => {
        const tuple = { user: 'user543', relation: 'admin', object: 'workspace:1' };
        const scope = nocks.expand(SANDCASTLE_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await sandcastleApi.expand({ tuple_key: tuple });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe('read', () => {
      it('should properly pass the errors that the sandcastle api returns', async () => {
        const tuple = { user: 'user543', relation: 'admin', object: 'workspace:1' };
        const scope = nocks.read(SANDCASTLE_STORE_ID, tuple);

        expect(scope.isDone()).toBe(false);
        const data = await sandcastleApi.read({ reads: { tuple_keys: [tuple] } });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe('writeNamespaceConfiguration', () => {
      it('should call the api and return the response', async () => {
        const nssConfig = { namespaces: [{ name: 'workspace', relations: { admin: { _this: {} } } }] };
        const scope = nocks.upsertNssConfig(SANDCASTLE_STORE_ID, nssConfig);

        expect(scope.isDone()).toBe(false);
        const data = await sandcastleApi.writeNamespaceConfiguration(nssConfig);

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ id: expect.any(String) });
      });
    });

    describe('readNamespaceConfiguration', () => {
      it('should call the api and return the response', async () => {
        const configId = 'string';
        const scope = nocks.readSingleNssConfig(SANDCASTLE_STORE_ID, configId);

        expect(scope.isDone()).toBe(false);
        const data = await sandcastleApi.readNamespaceConfiguration(configId);

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ configuration: { id: expect.any(String), namespaces: expect.arrayContaining([]) } });
      });
    });

    describe('readAllNamespaceConfigurations', () => {
      it('should call the api and return the response', async () => {
        const scope = nocks.readAllNssConfigs(SANDCASTLE_STORE_ID);

        expect(scope.isDone()).toBe(false);
        const data = await sandcastleApi.readAllNamespaceConfigurations();

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ configurations: expect.arrayContaining([]) });
      });
    });
  });
});
