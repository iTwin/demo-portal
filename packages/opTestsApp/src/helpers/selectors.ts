/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
export interface OIDCSelectors {
  v2: {
    usernameInput: string;
    nextInput: string;
    passwordInput: string;
    signInButton: string;
  };
  v1: {
    usernameInput: string;
    passwordInput: string;
    signInButton: string;
  };
}

export const OIDC: OIDCSelectors = {
  v2: {
    usernameInput: "id=identifierInput",
    nextInput: "id=postButton",
    passwordInput: "id=password",
    signInButton: "id=sign-in-button",
  },
  v1: {
    usernameInput: "css=[name='EmailAddress']",
    passwordInput: "css=[name='Password']",
    signInButton: "id=submitLogon",
  },
};

export interface HomeSelectors {
  icon: string;
  Portal: string;
  Card: {
    grid: string;
    thumbnail: string;
    title: string;
  };
}

export const Home: HomeSelectors = {
  icon: "css=.iui-header-logo",
  Portal: "text='My projects'",
  Card: {
    grid: "css=[class*=iac-grid-structure]",
    thumbnail: "css=.iui-tile-thumbnail",
    title: "css=.iui-tile-name-label",
  },
};

export interface ViewerSelectors {
  container: string;
}

export const Viewer: ViewerSelectors = {
  container: "css=.full-height-container",
};

export interface ErrorSelectors {
  Unauthorized: string;
  Component: string;
}

export const Error: ErrorSelectors = {
  Unauthorized: "text='Unauthorized'",
  Component: "css=.iui-non-ideal-state",
};
