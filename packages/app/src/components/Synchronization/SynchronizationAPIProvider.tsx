/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps } from "@reach/router";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

import { SynchronizationClient } from "../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../api/useApiPrefix";

type SynchronizationAPIProviderProps = PropsWithChildren<{
  accessToken: string;
}>;

export interface SynchronizationConfig {
  isAuthorized: boolean;
  authUrl?: string;
  login: () => void;
}

export const SynchronizationContext = createContext<SynchronizationConfig>({
  isAuthorized: false,
  login: () => {
    /** nop */
  },
});

export const SynchronizationAPIProvider = ({
  accessToken,
  children,
}: RouteComponentProps & SynchronizationAPIProviderProps) => {
  const urlPrefix = useApiPrefix();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authUrl, setAuthUrl] = useState<string>();
  const [client, setClient] = useState<SynchronizationClient>();

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    setClient(new SynchronizationClient(urlPrefix, accessToken));
  }, [accessToken, urlPrefix]);

  useEffect(() => {
    if (client) {
      client
        .getAuthorization(window.location.href)
        .then(({ authorizationInformation }) => {
          if (
            !authorizationInformation?.isUserAuthorized &&
            authorizationInformation?._links?.authorizationUrl?.href
          ) {
            setAuthUrl(authorizationInformation._links.authorizationUrl.href);
          } else {
            setIsAuthorized(true);
          }
        })
        .catch(console.error);
    }
  }, [client]);

  const login = () => {
    if (authUrl) {
      const loginWindow = window.open(authUrl, "_blank", "popup=yes");
      const loginInterval = setInterval(() => {
        if (loginWindow?.closed && client) {
          client
            .getAuthorization(window.location.href)
            .then(({ authorizationInformation }) => {
              if (authorizationInformation?.isUserAuthorized) {
                setIsAuthorized(true);
                clearInterval(loginInterval);
              }
            })
            .catch((error) => {
              console.error(error);
              clearInterval(loginInterval);
            });
        }
      }, 2000);
    } else {
      console.error(
        "Could not determine the url for synchronization authorization"
      );
    }
  };

  return (
    <SynchronizationContext.Provider value={{ isAuthorized, login, authUrl }}>
      {children}
    </SynchronizationContext.Provider>
  );
};
