# JavaScript and Node.js SDK for Okta Fine Grained Authorization (FGA)

[![npm](https://img.shields.io/npm/v/@auth0/fga.svg?style=flat)](https://www.npmjs.com/package/@auth0/fga)
[![Release](https://img.shields.io/github/v/release/auth0-lab/fga-js-sdk?sort=semver&color=green)](https://github.com/auth0-lab/fga-js-sdk/releases)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B4989%2Fgithub.com%2Fauth0-lab%2Ffga-js-sdk.svg?type=shield)](https://app.fossa.com/api/projects/custom%2B4989%2Fgithub.com%2Fauth0-lab%2Ffga-js-sdk.svg?type=shield)
[![Discord Server](https://img.shields.io/discord/759188666072825867?color=7289da&logo=discord "Discord Server")](https://discord.com/channels/759188666072825867/930524706854031421)

This is an autogenerated JavaScript SDK for Auth0 Fine Grained Authorization (FGA). It provides a wrapper around the [Auth0 Fine Grained Authorization API](https://docs.fga.dev/api/service), and includes TS typings.

Warning: This SDK comes with no SLAs and is not production-ready!

## Table of Contents

- [About Auth0 Fine Grained Authorization (FGA)](#about)
- [Resources](#resources)
- [Contributing](#contributing)
- [License](#license)

## About

 is an open source Fine-Grained Authorization solution inspired by [Google's Zanzibar paper](https://research.google/pubs/pub48190/). It was created by the FGA team at [Auth0/Okta](https://auth0.com).

[Okta Fine Grained Authorization (FGA)](https://fga.dev) is designed to make it easy for application builders to model their permission layer, and to add and integrate fine-grained authorization into their applications. Okta Fine Grained Authorization (FGA)’s design is optimized for reliability and low latency at a high scale.

This SDK is considered deprecated. We recommend using the [OpenFGA JS SDK](https://github.com/openfga/js-sdk) with the following configuration instead of this SDK:

```js
const { CredentialsMethod, OpenFgaClient } = require('@openfga/sdk'); // OR import { CredentialsMethod, OpenFgaClient } from '@openfga/sdk';

const fgaClient = new OpenFgaClient({
    apiUrl: "https://api.us1.fga.dev",
    storeId: process.env.FGA_STORE_ID,
    authorizationModelId: process.env.FGA_MODEL_ID,
    credentials: {
      method: CredentialsMethod.ClientCredentials,
      config: {
        apiTokenIssuer: "fga.us.auth0.com",
        apiAudience: "https://api.us1.fga.dev/",
        clientId: process.env.FGA_CLIENT_ID,
        clientSecret: process.env.FGA_CLIENT_SECRET,
      },
    }
});
```

For US1 (Production US) environment, use the following values:
- API URL: `https://api.us1.fga.dev`
- Credential Method: ClientCredentials
- API Token Issuer: `fga.us.auth0.com`
- API Audience: `https://api.us1.fga.dev/`

You can get the rest of the necessary variables from the FGA Dashboard. See [here](https://docs.fga.dev/intro/dashboard#create-api-credentials).

## Resources

- [Okta Fine Grained Authorization (FGA) Documentation](https://docs.fga.dev)
- [Okta Fine Grained Authorization (FGA) API Documentation](https://docs.fga.dev/api/service)
- [Zanzibar Academy](https://zanzibar.academy)
- [Google's Zanzibar Paper (2019)](https://research.google/pubs/pub48190/)


## Contributing

This repo is deprecated and no longer accepting contributions.

## Author

[Okta FGA](https://github.com/auth0-lab)

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/auth0-lab/fga-js-sdk/blob/main/LICENSE) file for more info.

The code in this repo was auto generated by [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator) from a template based on the [typescript-axios template](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/typescript-axios) and [go template](https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator/src/main/resources/go), licensed under the [Apache License 2.0](https://github.com/OpenAPITools/openapi-generator/blob/master/LICENSE).
