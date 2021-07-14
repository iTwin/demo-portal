/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@bentley/itwin-client";
import React, { useEffect, useState } from "react";

import "./App.scss";
import AuthorizationClient from "./AuthorizationClient";
import { AuthProvider } from "./components/Auth/AuthProvider";
import { Header } from "./components/Header/Header";
import { MainRouter } from "./components/Main";
import MainContainer from "./components/MainLayout/MainContainer";
import { Sidebar } from "./components/MainLayout/Sidebar";
import { DemoPortalConfig, getConfig } from "./config";
import { ConfigProvider } from "./config/ConfigProvider";
import { LaunchDarklyProvider } from "./components/LaunchDarkly/LaunchDarklyProvider";
import history from "./services/router/history";
import { ai } from "./services/telemetry";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthorizationClient.oidcClient
      ? AuthorizationClient.oidcClient.isAuthorized
      : false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [accessTokenObject, setAccessTokenObject] = useState<AccessToken>();
  // const [accessToken, setAccessToken] = useState("");
  const [appConfig, setAppConfig] = useState<DemoPortalConfig>();
  const [isWhitelisted, setIsWhitelisted] = useState(false);

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
            // setAccessToken(token?.toTokenString() ?? "");
            console.log(token?.getUserInfo());
            console.log(token?.toTokenString() ?? "");
          }
        );
      }

      try {
        // attempt silent signin
        await AuthorizationClient.signInSilent();
        setIsAuthenticated(AuthorizationClient.oidcClient.isAuthorized);
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
    if (isLoggingIn && isAuthenticated) {
      setIsLoggingIn(false);
    }
  }, [isAuthenticated, isLoggingIn]);

  useEffect(() => {
    if (accessTokenObject) {
      const userInfo = accessTokenObject.getUserInfo();
      void ai.initialize({ history }, userInfo);

      if (
        appConfig?.auth?.whitelistedUltimateIds &&
        userInfo?.featureTracking?.ultimateSite
      ) {
        setIsWhitelisted(
          appConfig.auth.whitelistedUltimateIds.includes(
            userInfo.featureTracking.ultimateSite
          )
        );
      }
    }
  }, [accessTokenObject, appConfig]);

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await AuthorizationClient.signIn();
  };

  const onLogoutClick = async () => {
    setIsLoggingIn(false);
    await AuthorizationClient.signOut();
    setIsAuthenticated(false);
  };

  return (
    <ConfigProvider {...appConfig}>
      <AuthProvider
        accessToken={accessTokenObject}
        userInfo={accessTokenObject?.getUserInfo()}
      >
        <LaunchDarklyProvider>
          <MainContainer
            header={
              <Header
                handleLogin={onLoginClick}
                loggedIn={isAuthenticated}
                handleLogout={onLogoutClick}
                accessTokenObject={accessTokenObject}
              />
            }
            sidebar={<Sidebar />}
          >
            {isLoggingIn ? (
              <span>"Logging in...."</span>
            ) : (
              isAuthenticated && (
                // isWhitelisted
                // ? (
                <MainRouter />
                // ) : (
                //   <ErrorPage errorType="401" />
                // )
              )
            )}
          </MainContainer>
        </LaunchDarklyProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
