import React, { useEffect, useState } from "react";
import { AccessToken, UserInfo } from "@bentley/itwin-client";
import { useConfig } from "../../config/ConfigProvider";
import AuthorizationClient from "../../AuthorizationClient";
import { ai } from "../../services/telemetry";

export interface AuthContextValue {
  accessToken?: AccessToken;
  userInfo?: UserInfo;
}

export interface AuthProviderProps extends AuthContextValue {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<AuthContextValue>({});

export const AuthProvider = ({ children, ...rest }: AuthProviderProps) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     AuthorizationClient.oidcClient
//       ? AuthorizationClient.oidcClient.isAuthorized
//       : false
//   );
//   const [accessTokenObject, setAccessTokenObject] = useState<AccessToken>();
//   const [userInfo, setUserInfo] = useState<UserInfo>()

//   const { auth } = useConfig();

//   useEffect(() => {
//     const initOidc = async () => {
//       if (!AuthorizationClient.oidcClient && auth) {
//         if (!auth.clientId) {
//           throw new Error(
//             "Please add a valid client ID in the .env.local file and restart the application"
//           );
//         }
//         await AuthorizationClient.initializeOidc(
//           auth.clientId,
//           auth.authority,
//           auth.apimAuthority
//         );
//         AuthorizationClient.apimClient.onUserStateChanged.addListener(
//           (token) => {
//             setAccessTokenObject(token);
//             ai.updateUserInfo(token?.getUserInfo())
//             // const userInfo = token?.getUserInfo();
//             // console.log("apim");
//             // console.log(userInfo);
//             // console.log(token?.toTokenString() ?? "");
//           }
//         );
//       }

//       try {
//         // attempt silent signin
//         await AuthorizationClient.signInSilent();
//         setIsAuthenticated(AuthorizationClient.oidcClient.isAuthorized);
//       } catch (error) {
//         // swallow the error. User can click the button to sign in
//       }
//     };
//     initOidc().catch((error) => console.error(error));
//   }, [auth]);


  return <AuthContext.Provider value={rest}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContext");
  }
  return context;
};
