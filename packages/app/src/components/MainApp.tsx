/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ErrorPage } from "@itwin/itwinui-react";
import React from "react";

import { MainRouter } from "../routers/MainRouter";
import { useAuth } from "./Auth/AuthProvider";
import { Header } from "./Header/Header";
import MainContainer from "./MainLayout/MainContainer";
import { Sidebar } from "./MainLayout/Sidebar";

export const MainApp = () => {
  const { isAuthenticated, isAuthorized, accessToken } = useAuth();

  return (
    <MainContainer
      header={
        <Header isAuthenticated={isAuthenticated} accessToken={accessToken} />
      }
      sidebar={<Sidebar />}
    >
      {isAuthenticated &&
        (isAuthorized ? (
          <MainRouter accessToken={accessToken} />
        ) : (
          <ErrorPage errorType="401" />
        ))}
    </MainContainer>
  );
};
