/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
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
    signInButton:
      "//a[contains(@class,'ping-button') and contains(@title,'Sign In')]",
  },
  v1: {
    usernameInput: "css=[name='EmailAddress']",
    passwordInput: "css=[name='Password']",
    signInButton: "id=submitLogon",
  },
};

export interface BaseSelectors {
  signInButton: string;
}

export const Base: BaseSelectors = {
  signInButton: "text='Sign In'",
};

export interface HomeSelectors {
  Portal: string;
  IModelSearch: string;
  ProjectSearch: string;
  Card: {
    thumbnail: string;
    overTitle: string;
    title: string;
    projectTitle: string;
  };
}

export interface DesignReviewSelectors {
  iframe: string;
  ninezone: string;
}

export const Home: HomeSelectors = {
  Portal: "text='Ad Hoc Review'",
  IModelSearch: "css=[class*=IModelBrowser_SearchBox] >> input",
  ProjectSearch: "css=[class*=ProjectsBrowser_SearchBox] >> input",
  Card: {
    thumbnail: "css=.iTwinCommon_Card_Thumbnail",
    overTitle: "css=.iTwinCommon_IModelCard_OverTitle",
    title: "css=.iTwinCommon_IModelCard_Title",
    projectTitle: "css=.iTwinCommon_ProjectCard_Title",
  },
};

export const DesignReview: DesignReviewSelectors = {
  iframe: 'iframe[data-testid="dr-iframe"]',
  ninezone: "id=uifw-ninezone-area",
};
