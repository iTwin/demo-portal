/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { getDisplayName } from "@bentley/ui-core";
import { ErrorPage } from "@itwin/itwinui-react";
import React, { useEffect, useState } from "react";

import { useConfig } from "../../config/ConfigProvider";
import { useAuth } from "./AuthProvider";

// eslint-disable-next-line @typescript-eslint/ban-types
export const withAuthorization = <P extends {}>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const HOC = ({ ...props }: P) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { auth } = useConfig();
    const { userInfo } = useAuth();

    useEffect(() => {
      if (auth?.whitelistedIds && userInfo?.organization?.id) {
        const whitelist = auth.whitelistedIds.split(" ");
        const orgId = userInfo.organization?.id;
        setIsAuthorized(whitelist.includes(orgId));
      }
    }, [auth, userInfo]);

    return isAuthorized ? (
      <Component {...props} />
    ) : (
      <ErrorPage errorType="401" />
    );
  };
  HOC.displayName = `withAuthorization_${getDisplayName(Component)}`;

  return HOC;
};
