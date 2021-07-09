import * as nock from 'nock';

import { NamespaceNamespaces, SandcastleApi, SandcastleTupleKey } from "../api";

nock.disableNetConnect();

const { SANDCASTLE_URL, SANDCASTLE_TENANT, SANDCASTLE_CLIENT_ID, SANDCASTLE_CLIENT_SECRET } = process.env as {
  SANDCASTLE_URL: string; SANDCASTLE_TENANT: string; SANDCASTLE_CLIENT_ID: string; SANDCASTLE_CLIENT_SECRET: string;
} & any;

const baseConfig = {
  tenant: SANDCASTLE_TENANT,
  serverUrl: SANDCASTLE_URL,
  clientId: SANDCASTLE_CLIENT_ID,
  clientSecret: SANDCASTLE_CLIENT_SECRET,
};

const nocks = {
  tokenExchange: (apiTokenIssuer: string, accessToken = 'access-token', expiresIn = 300) => {
    return nock(`https://${apiTokenIssuer}`)
      .post('/oauth/token')
      .reply(200, {
        access_token: accessToken,
        expires_in: expiresIn,
      });
  },
  readAllNssConfigs: (tenant: string, serverUrl = SANDCASTLE_URL) => {
    return nock(`${serverUrl}`)
      .get(`/${tenant}/v1/namespace-configurations`)
      .reply(200, {
        configurations: [],
      })
  },
  check: (tenant: string, tuple: SandcastleTupleKey, serverUrl = SANDCASTLE_URL) => {
    return nock(`${serverUrl}`)
      .post(`/${tenant}/v1/check`)
      .reply(200, {
        allowed: true,
      });
  },
  write: (tenant: string, tuple: SandcastleTupleKey, serverUrl = SANDCASTLE_URL) => {
    return nock(`${serverUrl}`)
      .post(`/${tenant}/v1/write`)
      .reply(200, {});
  },
  delete: (tenant: string, tuple: SandcastleTupleKey, serverUrl = SANDCASTLE_URL) => {
    return nock(`${serverUrl}`)
      .post(`/${tenant}/v1/write`)
      .reply(200, {});
  },
  read: (tenant: string, tuple: SandcastleTupleKey, serverUrl = SANDCASTLE_URL) => {
    return nock(`${serverUrl}`)
      .post(`/${tenant}/v1/read`)
      .reply(200, { tuples: [] });
  },
  expand: (tenant: string, tuple: SandcastleTupleKey, serverUrl = SANDCASTLE_URL) => {
    return nock(`${serverUrl}`)
      .post(`/${tenant}/v1/expand`)
      .reply(200, { tree: {} });
  },
  readSingleNssConfig: (tenant: string, configId: string, serverUrl = SANDCASTLE_URL) => {
    return nock(`${serverUrl}`)
      .get(`/${tenant}/v1/namespace-configurations/${configId}`)
      .reply(200, {
        configuration: { id: "some-id", namespaces: [] },
      });
  },
  upsertNssConfig: (tenant: string, configurations: NamespaceNamespaces, serverUrl = SANDCASTLE_URL) => {
    return nock(`${serverUrl}`)
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

    it('should not require clientId or clientSecret in configuration in non-prod environments', () => {
      expect(() => new SandcastleApi({ tenant: SANDCASTLE_TENANT, serverUrl: 'https://api.playground.sandcastle.cloud', clientId: undefined!, clientSecret: undefined! })).not.toThrowError();
    });

    it('should require clientId or clientSecret in configuration in prod environments', () => {
      expect(() => new SandcastleApi({ tenant: SANDCASTLE_TENANT, clientId: undefined!, clientSecret: undefined! })).toThrowError();
    });

    it('should not require serverUrl in configuration', () => {
      expect(() => new SandcastleApi({ ...baseConfig, serverUrl: undefined! })).not.toThrowError();
    });

    it('should issue a network call to get the token at the first request if client id is provided', async () => {
      const scope = nocks.tokenExchange('token-issuer.sandcastle.example');
      nocks.readAllNssConfigs(SANDCASTLE_TENANT);

      const sandcastleApi = new SandcastleApi({ ...baseConfig, apiTokenIssuer: 'token-issuer.sandcastle.example' });
      expect(scope.isDone()).toBe(false);

      await sandcastleApi.sandcastleReadAllNamespaceConfigurations();

      expect(scope.isDone()).toBe(true);

      nock.cleanAll();
    })

    it('should not issue a network call to get the token at the first request if the clientId is not provided', async () => {
      const scope = nocks.tokenExchange('token-issuer.sandcastle.example');
      const serverUrl = 'https://api.playground.sandcastle.cloud';
      nocks.readAllNssConfigs(SANDCASTLE_TENANT, serverUrl);

      const sandcastleApi = new SandcastleApi({ tenant: SANDCASTLE_TENANT, serverUrl, clientId: undefined!, clientSecret: undefined!, apiTokenIssuer: 'token-issuer.sandcastle.example' });
      expect(scope.isDone()).toBe(false);

      await sandcastleApi.sandcastleReadAllNamespaceConfigurations();

      expect(scope.isDone()).toBe(false);

      nock.cleanAll();
    })
  });

  describe('using the sdk', () => {
    let sandcastleApi: SandcastleApi;

    beforeAll(() => {
      sandcastleApi = new SandcastleApi({ ...baseConfig, apiTokenIssuer: 'token-issuer.sandcastle.example' });
    });

    beforeEach(() => {
      nocks.tokenExchange('token-issuer.sandcastle.example');
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
