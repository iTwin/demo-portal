/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Text } from "@itwin/itwinui-react";
import { navigate, RouteComponentProps } from "@reach/router";
import React, { PropsWithChildren } from "react";

import { SynchronizationClient } from "../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../api/useApiPrefix";

type SynchronizationAPIProviderProps = PropsWithChildren<{
  accessToken: string;
}>;

export const SynchronizationAPIProvider = ({
  accessToken,
  children,
}: RouteComponentProps & SynchronizationAPIProviderProps) => {
  const urlPrefix = useApiPrefix();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    if (!accessToken) {
      return;
    }

    const client = new SynchronizationClient(urlPrefix, accessToken);
    client
      .getAuthorization(window.location.href)
      .then(({ authorizationInformation }) => {
        if (
          !authorizationInformation?.isUserAuthorized &&
          authorizationInformation?._links?.authorizationUrl?.href
        ) {
          return navigate(
            authorizationInformation._links.authorizationUrl.href
          );
        }
        setIsAuthorized(true);
      })
      .catch(console.error);
  }, [accessToken, urlPrefix]);

  return <>{isAuthorized ? children : <Text isSkeleton={true} />}</>;
};
