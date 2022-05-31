/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ErrorPage, Text } from "@itwin/itwinui-react";
import React from "react";

import { MainRouter } from "../routers/MainRouter";
import { useAuth } from "./Auth/AuthProvider";
import { Header } from "./Header/Header";
import MainContainer from "./MainLayout/MainContainer";
import { Sidebar } from "./MainLayout/Sidebar";
import { SynchronizationAPIProvider } from "./Synchronization/SynchronizationAPIProvider";

export const MainApp = () => {
  const { isAuthenticated, isAuthorized, accessToken, signOut } = useAuth();

  return (
    <MainContainer
      header={
        <Header
          isAuthenticated={isAuthenticated}
          accessToken={accessToken}
          handleLogout={signOut}
        />
      }
      sidebar={<Sidebar />}
    >
      {isAuthenticated ? (
        isAuthorized ? (
          <SynchronizationAPIProvider accessToken={accessToken ?? ""}>
            <MainRouter accessToken={accessToken ?? ""} />
          </SynchronizationAPIProvider>
        ) : (
          <ErrorPage errorType="401" />
        )
      ) : (
        <Text isSkeleton={true} />
      )}
    </MainContainer>
  );
};
