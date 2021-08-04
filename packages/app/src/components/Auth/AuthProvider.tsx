/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken, UserInfo } from "@bentley/itwin-client";
import React, { useEffect, useMemo, useState } from "react";

import { useConfig } from "../../config/ConfigProvider";
import AuthClient from "../../services/auth/AuthClient";
import { ai } from "../../services/telemetry";

export interface AuthContextValue {
  isAttemptingSilentLogin: boolean;
  isAuthenticated: boolean;
  isAuthorized: boolean;
  accessToken?: AccessToken;
  userInfo?: UserInfo;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextValue>({
  isAttemptingSilentLogin: true,
  isAuthenticated: false,
  isAuthorized: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAttemptingSilentLogin, setIsAttemptingSilentLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthClient.oidcClient ? AuthClient.oidcClient.isAuthorized : false
  );
  const [accessToken, setAccessToken] = useState<AccessToken>();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const { auth } = useConfig();

  useEffect(() => {
    const initOidc = async () => {
      if (!auth) {
        return;
      }
      if (!AuthClient.oidcClient && auth) {
        if (!auth.clientId) {
          throw new Error(
            "Please add a valid client ID in the .env.local file and restart the application"
          );
        }
        await AuthClient.initializeOidc(
          auth.clientId,
          auth.authority,
          auth.apimAuthority
        );
        AuthClient.apimClient.onUserStateChanged.addListener((token) => {
          setIsAuthenticated(token?.isExpired(0) ?? false);
          setAccessToken(token);
          const userInfo = token?.getUserInfo();
          setUserInfo(userInfo);
          ai.updateUserInfo(userInfo);
        });
      }

      try {
        // attempt silent signin
        await AuthClient.signInSilent();
        setIsAuthenticated(AuthClient.oidcClient.isAuthorized);
      } catch (error) {
        // swallow the error. User can click the button to sign in
      } finally {
        setIsAttemptingSilentLogin(false);
      }
    };
    initOidc().catch((error) => console.error(error));
  }, [auth]);

  const isAuthorized = useMemo(() => {
    if (auth?.whitelistedIds && userInfo?.organization?.id) {
      const whitelist = auth.whitelistedIds.split(" ");
      const orgId = userInfo.organization?.id;
      return whitelist.includes(orgId);
    }
    return false;
  }, [auth, userInfo]);

  return (
    <AuthContext.Provider
      value={{
        isAttemptingSilentLogin,
        isAuthenticated,
        isAuthorized,
        accessToken,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContext");
  }
  return context;
};
