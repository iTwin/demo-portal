/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { UserInfo } from "@bentley/itwin-client";
import { withLDProvider } from "launchdarkly-react-client-sdk";
import React, { useEffect, useState } from "react";

import AuthorizationClient from "./AuthorizationClient";

export const LaunchDarklyLauncher = (app: any) => {
  const clientID = process.env.IMJS_LD_CLIENT_ID;
  const deferInitialization = false;
  const [user, setUser] = useState<UserInfo>();

  useEffect(() => {
    AuthorizationClient.apimClient.onUserStateChanged.addListener((token) => {
      setUser(token?.getUserInfo());
    });
  });

  const UpdatedLaunchDarklyApp = (user: UserInfo | undefined) => {
    return withLDProvider({
      clientSideID: clientID as string,
      deferInitialization: deferInitialization,
      user: {
        key: user?.id.toUpperCase(),
        name: user?.email?.id,
      },
    })(app);
  };

  return UpdatedLaunchDarklyApp(user);
};
