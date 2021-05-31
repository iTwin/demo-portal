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
import { StayTunedRouter } from "./components/StayTunedRouter/StayTunedRouter";
import { ViewRouter } from "./components/ViewRouter/ViewRouter";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    AuthorizationClient.oidcClient
      ? AuthorizationClient.oidcClient.isAuthorized
      : false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [accessTokenObject, setAccessTokenObject] = useState<AccessToken>();

  useEffect(() => {
    const initOidc = async () => {
      if (!AuthorizationClient.oidcClient) {
        await AuthorizationClient.initializeOidc();
        AuthorizationClient.apimClient.onUserStateChanged.addListener(
          setAccessTokenObject
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
  }, []);

  useEffect(() => {
    if (!process.env.IMJS_AUTH_CLIENT_CLIENT_ID) {
      throw new Error(
        "Please add a valid client ID in the .env.local file and restart the application"
      );
    }
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
              accessToken={accessTokenObject?.toTokenString() ?? ""}
              path="view/*"
            />
            <StayTunedRouter
              path="validate/*"
              featureName={"Validate iModel"}
            />
            <StayTunedRouter path="compare/*" featureName={"Version Compare"} />
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
  );
};

export default App;
