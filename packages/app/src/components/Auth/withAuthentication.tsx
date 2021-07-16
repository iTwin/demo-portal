/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { getDisplayName } from "@bentley/ui-core";
import { ErrorPage } from "@itwin/itwinui-react";
import React, { useEffect, useState } from "react";

import { useConfig } from "../../config/ConfigProvider";
import { useAuth } from "./AuthProvider";

export const withAuthorization = (Component: any) => {
  const HOC = (Component: any) => {
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

    return isAuthorized ? Component : <ErrorPage errorType="401" />;
  };
  HOC.displayName = `withAuthorization_${getDisplayName(Component)}`;

  return HOC;
};
