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

import { OpenFgaClient } from "@openfga/sdk";
import { Configuration, UserClientConfigurationParams } from "./configuration";
import { AxiosInstance } from "axios";

export class Auth0FgaClient extends OpenFgaClient {
  constructor(configuration: Configuration | UserClientConfigurationParams, protected axios?: AxiosInstance) {
    let config = configuration;
    if (!(config instanceof Configuration)) {
      config = new Configuration(config);
    }

    super(config, axios);
  }
}

export class OktaFgaClient extends Auth0FgaClient {}