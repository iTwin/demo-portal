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
  useCallback,
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
  login: () => Promise<boolean>;
}

export const SynchronizationContext = createContext<SynchronizationConfig>({
  isAuthorized: false,
  login: () => {
    return Promise.resolve(true);
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
    if (client && !isAuthorized) {
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
  }, [client, isAuthorized]);

  const login = useCallback(
    () =>
      new Promise<boolean>((resolve, reject) => {
        if (isAuthorized) {
          resolve(true);
        }
        if (authUrl) {
          const loginWindow = window.open(authUrl, "_blank", "popup=yes");
          const loginInterval = setInterval(() => {
            if (loginWindow?.closed && client) {
              client
                .getAuthorization(window.location.href)
                .then(({ authorizationInformation }) => {
                  if (authorizationInformation?.isUserAuthorized) {
                    setIsAuthorized(true);
                    resolve(true);
                  } else {
                    setIsAuthorized(false);
                    resolve(false);
                  }
                  clearInterval(loginInterval);
                })
                .catch((error) => {
                  clearInterval(loginInterval);
                  reject(error);
                });
            }
          }, 2000);
        } else {
          reject(
            "Could not determine the url for synchronization authorization"
          );
        }
      }),
    [authUrl, client, isAuthorized]
  );

  return (
    <SynchronizationContext.Provider value={{ isAuthorized, login }}>
      {children}
    </SynchronizationContext.Provider>
  );
};
