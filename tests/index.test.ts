import * as nock from 'nock';

import { NamespaceNamespaces, SandcastleApi, SandcastleTupleKey } from "../api";
import { Configuration } from "../configuration";

nock.disableNetConnect();

const { SANDCASTLE_ENVIRONMENT, SANDCASTLE_TENANT, SANDCASTLE_CLIENT_ID, SANDCASTLE_CLIENT_SECRET } = process.env as {
  SANDCASTLE_ENVIRONMENT: string; SANDCASTLE_TENANT: string; SANDCASTLE_CLIENT_ID: string; SANDCASTLE_CLIENT_SECRET: string;
} & any;

const baseConfig = {
  tenant: SANDCASTLE_TENANT,
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
  readAllNssConfigs: (tenant: string, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .get(`/${tenant}/v1/namespace-configurations`)
      .reply(200, {
        configurations: [],
      })
  },
  check: (tenant: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${tenant}/v1/check`)
      .reply(200, {
        allowed: true,
      });
  },
  write: (tenant: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${tenant}/v1/write`)
      .reply(200, {});
  },
  delete: (tenant: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${tenant}/v1/write`)
      .reply(200, {});
  },
  read: (tenant: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${tenant}/v1/read`)
      .reply(200, { tuples: [] });
  },
  expand: (tenant: string, tuple: SandcastleTupleKey, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${tenant}/v1/expand`)
      .reply(200, { tree: {} });
  },
  readSingleNssConfig: (tenant: string, configId: string, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .get(`/${tenant}/v1/namespace-configurations/${configId}`)
      .reply(200, {
        configuration: { id: "some-id", namespaces: [] },
      });
  },
  upsertNssConfig: (tenant: string, configurations: NamespaceNamespaces, serverUrl = defaultConfiguration.serverUrl) => {
    return nock(serverUrl)
      .post(`/${tenant}/v1/namespace-configurations`)
      .reply(200, {
        id: "some-new-id",
      });
  }
}

describe('sandcastle-sdk', function () {
  describe('initializing the sdk', () => {
    it('should require tenant in configuration', () => {
      expect(() => new SandcastleApi({ ...baseConfig, tenant: undefined! })).toThrowError();
    });

    it('should require environment in configuration', () => {
      expect(() => new SandcastleApi({ ...baseConfig, environment: undefined! })).toThrowError();
    });

    it('should require a valid environment in configuration', () => {
      expect(() => new SandcastleApi({ ...baseConfig, environment: 'non_existent_environment'! })).toThrowError();
    });

    it('should not require clientId or clientSecret in configuration in environments that don\'t require it', () => {
      expect(() => new SandcastleApi({ tenant: SANDCASTLE_TENANT, environment: 'playground', clientId: undefined!, clientSecret: undefined! })).not.toThrowError();
    });

    it('should require clientId or clientSecret in configuration in environments that require it', () => {
      expect(() => new SandcastleApi({ tenant: SANDCASTLE_TENANT, environment: 'staging', clientId: undefined!, clientSecret: undefined! })).toThrowError();
    });

    it('should issue a network call to get the token at the first request if client id is provided', async () => {
      const scope = nocks.tokenExchange(defaultConfiguration.apiTokenIssuer!);
      nocks.readAllNssConfigs(SANDCASTLE_TENANT);

      const sandcastleApi = new SandcastleApi(baseConfig);
      expect(scope.isDone()).toBe(false);

      await sandcastleApi.sandcastleReadAllNamespaceConfigurations();

      expect(scope.isDone()).toBe(true);

      nock.cleanAll();
    })

    it('should not issue a network call to get the token at the first request if the clientId is not provided', async () => {
      const scope = nocks.tokenExchange(defaultConfiguration.apiTokenIssuer!);
      nocks.readAllNssConfigs(SANDCASTLE_TENANT);

      const sandcastleApi = new SandcastleApi({ tenant: SANDCASTLE_TENANT, environment: 'playground', clientId: undefined!, clientSecret: undefined! });
      expect(scope.isDone()).toBe(false);

      await sandcastleApi.sandcastleReadAllNamespaceConfigurations();

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
        const scope = nocks.check(SANDCASTLE_TENANT, tuple);

        expect(scope.isDone()).toBe(false);
        const { data } = await sandcastleApi.sandcastleCheck({ tupleKey: tuple });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ allowed: expect.any(Boolean) });
      });
    });

    describe('write: write tuples', () => {
      it('should properly pass the errors that the sandcastle api returns', async () => {
        const tuple = { user: 'user543', relation: 'admin', object: 'workspace:1' };
        const scope = nocks.write(SANDCASTLE_TENANT, tuple);

        expect(scope.isDone()).toBe(false);
        const { data } = await sandcastleApi.sandcastleWrite({ writes: { tupleKeys: [tuple] } });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe('write: delete tuples', () => {
      it('should properly pass the errors that the sandcastle api returns', async () => {
        const tuple = { user: 'user543', relation: 'admin', object: 'workspace:1' };
        const scope = nocks.delete(SANDCASTLE_TENANT, tuple);

        expect(scope.isDone()).toBe(false);
        const { data } = await sandcastleApi.sandcastleWrite({ deletes: { tupleKeys: [tuple] } });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe('expand', () => {
      it('should properly pass the errors that the sandcastle api returns', async () => {
        const tuple = { user: 'user543', relation: 'admin', object: 'workspace:1' };
        const scope = nocks.expand(SANDCASTLE_TENANT, tuple);

        expect(scope.isDone()).toBe(false);
        const { data } = await sandcastleApi.sandcastleExpand({ tupleKey: tuple });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe('read', () => {
      it('should properly pass the errors that the sandcastle api returns', async () => {
        const tuple = { user: 'user543', relation: 'admin', object: 'workspace:1' };
        const scope = nocks.read(SANDCASTLE_TENANT, tuple);

        expect(scope.isDone()).toBe(false);
        const { data } = await sandcastleApi.sandcastleRead({ reads: { tupleKeys: [tuple] } });

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({});
      });
    });

    describe('writeNamespaceConfiguration', () => {
      it('should call the api and return the response', async () => {
        const nssConfig = { namespaces: [{ name: 'workspace', relations: { admin: { _this: {} } } }] };
        const scope = nocks.upsertNssConfig(SANDCASTLE_TENANT, nssConfig);

        expect(scope.isDone()).toBe(false);
        const { data } = await sandcastleApi.sandcastleWriteNamespaceConfiguration(nssConfig);

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ id: expect.any(String) });
      });
    });

    describe('readNamespaceConfiguration', () => {
      it('should call the api and return the response', async () => {
        const configId = 'string';
        const scope = nocks.readSingleNssConfig(SANDCASTLE_TENANT, configId);

        expect(scope.isDone()).toBe(false);
        const { data } = await sandcastleApi.sandcastleReadNamespaceConfiguration(configId);

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ configuration: { id: expect.any(String), namespaces: expect.arrayContaining([]) } });
      });
    });

    describe('readAllNamespaceConfigurations', () => {
      it('should call the api and return the response', async () => {
        const scope = nocks.readAllNssConfigs(SANDCASTLE_TENANT);

        expect(scope.isDone()).toBe(false);
        const { data } = await sandcastleApi.sandcastleReadAllNamespaceConfigurations();

        expect(scope.isDone()).toBe(true);
        expect(data).toMatchObject({ configurations: expect.arrayContaining([]) });
      });
    });
  });
});
