/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { BrowserAuthorizationClient } from "@bentley/frontend-authorization-client";
import { FrontendRequestContext } from "@bentley/imodeljs-frontend";

class AuthClient {
  private static _client?: BrowserAuthorizationClient;

  public static get client(): BrowserAuthorizationClient | undefined {
    return this._client;
  }

  public static initialize(
    clientId: string,
    authority: string
  ): BrowserAuthorizationClient {
    if (this._client) {
      return this._client;
    }

    const scope = process.env.IMJS_AUTH_CLIENT_SCOPES ?? "";
    const redirectUri = `${window.location.origin}/signin-callback`;
    const postSignoutRedirectUri = window.location.origin;

    this._client = new BrowserAuthorizationClient({
      clientId,
      redirectUri,
      postSignoutRedirectUri,
      scope,
      responseType: "code",
      authority,
    });

    return this._client;
  }

  public static async signIn(): Promise<void> {
    await this.client?.signIn(new FrontendRequestContext());
  }

  public static async signInSilent(): Promise<void> {
    await this.client?.signInSilent(new FrontendRequestContext());
  }

  public static async signOut(): Promise<void> {
    await this.client?.signOut(new FrontendRequestContext());
  }

  public static dispose(): void {
    this._client = undefined;
  }
}

export default AuthClient;
