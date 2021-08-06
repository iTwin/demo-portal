/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { FillCentered } from "@bentley/ui-core";
import { ErrorPage } from "@itwin/itwinui-react";
import React, { useState } from "react";

import { MainRouter } from "../routers/MainRouter";
import AuthClient from "../services/auth/AuthClient";
import { useAuth } from "./Auth/AuthProvider";
import { Header } from "./Header/Header";
import MainContainer from "./MainLayout/MainContainer";
import { Sidebar } from "./MainLayout/Sidebar";

export const MainApp = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const {
    accessToken,
    isAuthenticated,
    isAuthorized,
    isAttemptingSilentLogin,
  } = useAuth();

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    // await AuthClient.signIn();
    await AuthClient.signInSilent();
  };

  const onLogoutClick = async () => {
    setIsLoggingIn(false);
    await AuthClient.signOut();
  };

  return (
    <MainContainer
      header={
        <Header
          handleLogin={onLoginClick}
          handleLogout={onLogoutClick}
          loggedIn={isAuthenticated}
          isLoggingIn={isAttemptingSilentLogin || isLoggingIn}
          accessTokenObject={accessToken}
        />
      }
      sidebar={<Sidebar />}
    >
      {isLoggingIn ? (
        <FillCentered>{"Logging in...."}</FillCentered>
      ) : (
        isAuthenticated &&
        (isAuthorized ? <MainRouter /> : <ErrorPage errorType="401" />)
      )}
    </MainContainer>
  );
};
