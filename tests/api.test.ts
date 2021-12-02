import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

import { Auth0FgaApi, Auth0FgaCheckResponse } from '../api';
import { CallResult } from '../common';

const storeId = 'test';

describe('Auth0 FGA API', () => {
  let api: Auth0FgaApi;

  beforeAll(() => {
    api = new Auth0FgaApi({
      storeId,
      clientId: 'test1234',
      clientSecret: 'test456',
      environment: 'staging'
    });
  })

  describe('happy path of CHECK', () => {
    let result: CallResult<Auth0FgaCheckResponse>;

    beforeAll(async () => {
      const tupleKey = {
        object: 'foobar:x',
        user: 'user:xyz'
      };

      mock.onPost(`https://sandcastle-dev.us.auth0.com/oauth/token`).reply(200, {
        access_token: 'test-token'
      });

      mock.onPost(
        `https://api.staging.fga.dev/${storeId}/check`,
        {
          tuple_key: tupleKey
        },
        expect.objectContaining({ Authorization: 'Bearer test-token' })
      ).reply(200, {
        allowed: true
      });
      result = await api.check({ tuple_key: tupleKey });
    });

    it('should return allowed', () => {
      expect(result.allowed).toBe(true);
    });

    it('should return the proper $response object', () => {
      expect(result).toHaveProperty('$response');
      expect(result.$response.status).toBe(200);
      expect(result.propertyIsEnumerable('$response')).toBe(false);
    });
  });
});
