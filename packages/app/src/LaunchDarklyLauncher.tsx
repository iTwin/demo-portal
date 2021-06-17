/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { UserInfo } from "@bentley/itwin-client";
import { LDProvider } from "launchdarkly-react-client-sdk";
import { ProviderConfig } from "launchdarkly-react-client-sdk/lib/types";
import React, { useEffect, useState } from "react";

import AuthorizationClient from "./AuthorizationClient";

export const LaunchDarklyLauncher = () => {
  const props: ProviderConfig = {
    clientSideID: process.env.IMJS_LD_CLIENT_ID as string,
    deferInitialization: false,
  };
  const [user, setUser] = useState<UserInfo>();

  useEffect(() => {
    AuthorizationClient.apimClient?.onUserStateChanged.addListener((token) => {
      setUser(token?.getUserInfo());
    });
  });

  const UpdatedLaunchDarklyApp = (user: UserInfo | undefined) => {
    const userProps = { key: user?.id, name: user?.email?.id };
    const newProps = { ...props, userProps };

    return <LDProvider {...newProps} />;
  };

  return UpdatedLaunchDarklyApp(user);
};
