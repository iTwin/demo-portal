/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  BrowserAuthorizationClient,
  BrowserAuthorizationClientConfiguration,
} from "@bentley/frontend-authorization-client";
import { FrontendRequestContext } from "@bentley/imodeljs-frontend";

class AuthorizationClient {
  private static _oidcClient: BrowserAuthorizationClient;
  private static _apimClient: BrowserAuthorizationClient;

  public static get oidcClient(): BrowserAuthorizationClient {
    return this._oidcClient;
  }

  public static get apimClient(): BrowserAuthorizationClient {
    return this._apimClient;
  }

  public static async initializeOidc(
    clientId: string,
    authority: string,
    apimAuthority: string
  ): Promise<void> {
    if (this._oidcClient && this._apimClient) {
      return;
    }

    const scope = process.env.IMJS_AUTH_CLIENT_SCOPES ?? "";
    const redirectUri = `${window.location.origin}/signin-callback`;
    const postSignoutRedirectUri = window.location.origin;

    // authority is optional and will default to Production IMS
    const oidcConfiguration: BrowserAuthorizationClientConfiguration = {
      clientId,
      redirectUri,
      postSignoutRedirectUri,
      scope,
      responseType: "code",
      authority,
    };

    if (!this._oidcClient) {
      this._oidcClient = new BrowserAuthorizationClient(oidcConfiguration);
    }
    if (!this._apimClient) {
      this._apimClient = new BrowserAuthorizationClient({
        ...oidcConfiguration,
        authority: apimAuthority,
      });
    }
  }

  public static async signIn(): Promise<void> {
    await this.oidcClient.signIn(new FrontendRequestContext());
    await this.apimClient.signInSilent(new FrontendRequestContext());
  }

  public static async signInSilent(): Promise<void> {
    await this.oidcClient.signInSilent(new FrontendRequestContext());
    await this.apimClient.signInSilent(new FrontendRequestContext());
  }

  public static async signOut(): Promise<void> {
    await this.oidcClient.signOut(new FrontendRequestContext());
    await this.apimClient.signOut(new FrontendRequestContext());
  }
}

export default AuthorizationClient;
