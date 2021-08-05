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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<AccessToken>();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const { auth } = useConfig();

  useEffect(() => {
    const updateAuthContext = (token?: AccessToken) => {
      setIsAuthenticated(token?.isExpired(0) ?? false);
      setAccessToken(token);
      const userInfo = token?.getUserInfo();
      setUserInfo(userInfo);
      ai.updateUserInfo(userInfo);
    };

    const initOidc = async () => {
      if (!auth) {
        return;
      }
      if (!AuthClient.client) {
        if (!auth.clientId) {
          throw new Error(
            "Please add a valid client ID in the .env.local file and restart the application"
          );
        }
        await AuthClient.initialize(auth.clientId, auth.authority);
      }

      AuthClient.client.onUserStateChanged.addListener(updateAuthContext);

      try {
        // attempt silent signin
        await AuthClient.signInSilent();
        // await AuthClient.signIn();
        setIsAuthenticated(AuthClient.client.isAuthorized);
      } catch (error) {
        // swallow the error. User can click the button to sign in
      } finally {
        setIsAttemptingSilentLogin(false);
      }
    };

    initOidc().catch(console.error);

    return () => {
      AuthClient.client?.onUserStateChanged.removeListener(updateAuthContext);
    };
  }, [auth]);

  useEffect(() => {
    const silentRenew = async () => {
      await AuthClient.signInSilent();
    };
    if (AuthClient.client && !isAuthenticated) {
      silentRenew().catch(console.error);
    }
  }, [isAuthenticated]);

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
