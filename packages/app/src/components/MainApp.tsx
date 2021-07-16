/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React, { useState } from "react";

import AuthClient from "../services/auth/AuthClient";
import { useAuth } from "./Auth/AuthProvider";
import { Header } from "./Header/Header";
import MainContainer from "./MainLayout/MainContainer";
import { Sidebar } from "./MainLayout/Sidebar";
import { MainRouter } from "./MainRouter";

export const MainApp = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { accessToken, isAuthenticated } = useAuth();

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await AuthClient.signIn();
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
          accessTokenObject={accessToken}
        />
      }
      sidebar={<Sidebar />}
    >
      {isLoggingIn ? (
        <span>"Logging in...."</span>
      ) : (
        isAuthenticated && <MainRouter />
      )}
    </MainContainer>
  );
};
