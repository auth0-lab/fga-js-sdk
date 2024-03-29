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

import { OpenFgaApi } from "@openfga/sdk";
import { Configuration, UserConfigurationParams } from "./configuration";
import { AxiosInstance } from "axios";

export class Auth0FgaApi extends OpenFgaApi {
  constructor(
    configuration: Configuration | UserConfigurationParams,
    protected axios?: AxiosInstance,
  ) {
    let config = configuration;
    if (!(config instanceof Configuration)) {
      config = new Configuration(config);
    }

    super(config, axios);
  }
}

export class OktaFgaApi extends Auth0FgaApi {}
