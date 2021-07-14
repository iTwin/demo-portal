import React, { useState } from "react";
import AuthClient from "../services/auth/AuthClient";
import { useAuth } from "./Auth/AuthProvider";
import { Header } from "./Header/Header";
import MainContainer from "./MainLayout/MainContainer";
import { Sidebar } from "./MainLayout/Sidebar";
import { MainRouter } from "./MainRouter";

export const MainApp = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthClient.oidcClient
      ? AuthClient.oidcClient.isAuthorized
      : false
  );
  const { accessToken: accessTokenObject } = useAuth();

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await AuthClient.signIn();
  };

  const onLogoutClick = async () => {
    setIsLoggingIn(false);
    await AuthClient.signOut();
    setIsAuthenticated(false);
  };

  return (
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
        isAuthenticated && <MainRouter />
      )}
    </MainContainer>
  );
};
