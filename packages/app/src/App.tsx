/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@bentley/itwin-client";
import { Redirect, Router } from "@reach/router";
import React, { useEffect, useState } from "react";

import "./App.scss";
import AuthorizationClient from "./AuthorizationClient";
import { Header } from "./components/Header/Header";
import MainContainer from "./components/MainLayout/MainContainer";
import { Sidebar } from "./components/MainLayout/Sidebar";
import { ManageVersionsRouter } from "./components/ManageVersionsRouter/ManageVersionsRouter";
import { StayTunedRouter } from "./components/StayTunedRouter/StayTunedRouter";
import { SynchronizationRouter } from "./components/SynchronizationRouter/SynchronizationRouter";
import { ViewRouter } from "./components/ViewRouter/ViewRouter";
import { DemoPortalConfig, getConfig } from "./config";
import { ConfigProvider } from "./config/ConfigProvider";
import { LaunchDarklyLauncher } from "./LaunchDarklyLauncher";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    AuthorizationClient.oidcClient
      ? AuthorizationClient.oidcClient.isAuthorized
      : false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [accessTokenObject, setAccessTokenObject] = useState<AccessToken>();
  const [accessToken, setAccessToken] = useState("");
  const [appConfig, setAppConfig] = useState<DemoPortalConfig>();

  useEffect(() => {
    const initOidc = async () => {
      if (!AuthorizationClient.oidcClient && appConfig?.auth) {
        if (!appConfig.auth.clientId) {
          throw new Error(
            "Please add a valid client ID in the .env.local file and restart the application"
          );
        }
        await AuthorizationClient.initializeOidc(
          appConfig.auth.clientId,
          appConfig.auth.authority,
          appConfig.auth.apimAuthority
        );
        AuthorizationClient.apimClient.onUserStateChanged.addListener(
          (token) => {
            setAccessTokenObject(token);
            setAccessToken(token?.toTokenString() ?? "");
          }
        );
      }

      try {
        // attempt silent signin
        await AuthorizationClient.signInSilent();
        setIsAuthorized(AuthorizationClient.oidcClient.isAuthorized);
      } catch (error) {
        // swallow the error. User can click the button to sign in
      }
    };
    initOidc().catch((error) => console.error(error));
  }, [appConfig]);

  useEffect(() => {
    void getConfig().then((config) => {
      setAppConfig(config);
    });
  }, []);

  useEffect(() => {
    if (isLoggingIn && isAuthorized) {
      setIsLoggingIn(false);
    }
  }, [isAuthorized, isLoggingIn]);

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await AuthorizationClient.signIn();
  };

  const onLogoutClick = async () => {
    setIsLoggingIn(false);
    await AuthorizationClient.signOut();
    setIsAuthorized(false);
  };

  return (
    <ConfigProvider {...appConfig}>
      <LaunchDarklyLauncher token={accessTokenObject}>
        <MainContainer
          header={
            <Header
              handleLogin={onLoginClick}
              loggedIn={isAuthorized}
              handleLogout={onLogoutClick}
              accessTokenObject={accessTokenObject}
            />
          }
          sidebar={<Sidebar />}
        >
          {isLoggingIn ? (
            <span>"Logging in...."</span>
          ) : (
            isAuthorized && (
              <Router className={"router"}>
                <ViewRouter
                  accessToken={accessToken}
                  path="view/*"
                  email={accessTokenObject?.getUserInfo()?.email?.id ?? ""}
                />
                <SynchronizationRouter
                  path="synchronize/*"
                  accessToken={accessToken}
                  email={accessTokenObject?.getUserInfo()?.email?.id ?? ""}
                />
                <ManageVersionsRouter
                  path="manage-versions/*"
                  accessToken={accessToken}
                  email={accessTokenObject?.getUserInfo()?.email?.id ?? ""}
                />
                <StayTunedRouter
                  path="validate/*"
                  featureName={"Validate iModel"}
                />
                <StayTunedRouter
                  path="compare/*"
                  featureName={"Version Compare"}
                />
                <StayTunedRouter path="query/*" featureName={"Query"} />
                <StayTunedRouter path="report/*" featureName={"Report"} />
                <StayTunedRouter
                  path="ai-ml/*"
                  featureName={"Artifical Intelligence - Machine Learning"}
                />
                <Redirect noThrow={true} from="/" to="view" default={true} />
              </Router>
            )
          )}
        </MainContainer>
      </LaunchDarklyLauncher>
    </ConfigProvider>
  );
};

export default App;
