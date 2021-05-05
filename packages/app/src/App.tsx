/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IncludePrefix } from "@bentley/itwin-client";
import { Redirect, Router } from "@reach/router";
import React, { useEffect, useState } from "react";

import "./App.scss";
import AuthorizationClient from "./AuthorizationClient";
import { Header } from "./Header";
import { ViewRoute } from "./routes/ViewRoute";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    AuthorizationClient.oidcClient
      ? AuthorizationClient.oidcClient.isAuthorized
      : false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const initOidc = async () => {
      if (!AuthorizationClient.oidcClient) {
        await AuthorizationClient.initializeOidc();
        AuthorizationClient.apimClient.onUserStateChanged.addListener(
          (accessToken) => {
            setAccessToken(accessToken?.toTokenString(IncludePrefix.Yes) ?? "");
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
    <div>
      <Header
        handleLogin={onLoginClick}
        loggedIn={isAuthorized}
        handleLogout={onLogoutClick}
      />
      {isLoggingIn ? (
        <span>"Logging in...."</span>
      ) : (
        isAuthorized && (
          <Router>
            <ViewRoute accessToken={accessToken} path="view/*" />
            <Redirect noThrow={true} from="/" to="view" default={true} />
          </Router>
        )
      )}
    </div>
  );
};

export default App;
