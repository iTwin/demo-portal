import React, { useEffect, useState } from "react";
import { AccessToken, UserInfo } from "@bentley/itwin-client";
import { useConfig } from "../../config/ConfigProvider";
import AuthClient from "../../services/auth/AuthClient";
import { ai } from "../../services/telemetry";

export interface AuthContextValue {
  isAuthenticated?: boolean;
  accessToken?: AccessToken;
  userInfo?: UserInfo;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<AuthContextValue>({});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthClient.oidcClient
      ? AuthClient.oidcClient.isAuthorized
      : false
  );
  const [accessTokenObject, setAccessTokenObject] = useState<AccessToken>();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const { auth } = useConfig();

  useEffect(() => {
    const initOidc = async () => {
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
        AuthClient.apimClient.onUserStateChanged.addListener(
          (token) => {
            setAccessTokenObject(token);
            const userInfo = token?.getUserInfo();
            setUserInfo(userInfo);
            ai.updateUserInfo(userInfo);
            console.log(userInfo);
            console.log(token?.toTokenString() ?? "");
          }
        );
      }

      try {
        // attempt silent signin
        await AuthClient.signInSilent();
        setIsAuthenticated(AuthClient.oidcClient.isAuthorized);
      } catch (error) {
        // swallow the error. User can click the button to sign in
      }
    };
    initOidc().catch((error) => console.error(error));
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken: accessTokenObject,
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
