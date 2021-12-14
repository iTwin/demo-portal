/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken, UserInfo } from "@bentley/itwin-client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useConfig } from "../../config/ConfigProvider";
import AuthClient from "../../services/auth/AuthClient";
import { ai } from "../../services/telemetry";
import { ClientIdForm } from "./ClientIdForm";

export interface AuthContextValue {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  accessToken?: AccessToken;
  userInfo?: UserInfo;
  signOut: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextValue>({
  isAuthenticated: false,
  isAuthorized: false,
  signOut: async () => {
    await AuthClient.signOut();
  },
});

const LOCAL_STORAGE_CLIENT_KEY = "idp-auth-client-id";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<AccessToken>();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const { auth } = useConfig();

  const [clientId, setClientId] = React.useState(
    localStorage.getItem(LOCAL_STORAGE_CLIENT_KEY)
  );
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CLIENT_KEY, clientId ?? "");
  }, [clientId]);

  useEffect(() => {
    if (!clientId) {
      return;
    }
    const initAuth = async () => {
      if (!auth) {
        return;
      }
      if (!AuthClient.client) {
        if (!clientId) {
          throw new Error(
            "Please add a valid client ID in the .env.local file and restart the application"
          );
        }
        const client = AuthClient.initialize(clientId, auth.authority);
        client.onUserStateChanged.addListener((token?: AccessToken) => {
          setAccessToken(token);
          const userInfo = token?.getUserInfo();
          setUserInfo(userInfo);
          ai.updateUserInfo(userInfo);
        });
      }

      try {
        // attempt silent signin
        await AuthClient.signInSilent();
      } catch (error) {
        // if silent sign in fails, have user manually sign in
        await AuthClient.signIn();
      }
    };

    initAuth().catch(console.error);

    return () => {
      AuthClient.dispose();
    };
  }, [auth, clientId]);

  const isAuthorized = useMemo(() => {
    if (auth?.whitelistedIds) {
      if (userInfo?.organization?.id) {
        const whitelist = auth.whitelistedIds.split(" ");
        const orgId = userInfo.organization?.id;
        return whitelist.includes(orgId);
      }
      return false;
    }
    return true;
  }, [auth, userInfo]);

  const signOut = useCallback(async () => {
    await AuthClient.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        isAuthorized,
        accessToken,
        userInfo,
        signOut,
      }}
    >
      {clientId ? children : <ClientIdForm onSave={setClientId} />}
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
