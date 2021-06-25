/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { LDProvider } from "launchdarkly-react-client-sdk";
import React, { useEffect, useState } from "react";

import AuthorizationClient from "./AuthorizationClient";
import { useConfig } from "./config/ConfigProvider";

export interface LDUserProps {
  key: string;
  name: string;
}

export const LaunchDarklyLauncher = (props: any) => {
  const [userProps, setUserProps] = useState<LDUserProps>();
  const clientId = useConfig().ldClientId;

  useEffect(() => {
    return AuthorizationClient.apimClient?.onUserStateChanged.addListener(
      (token) => {
        const user = token?.getUserInfo();
        const newUserProps = {
          key: user?.id.toUpperCase() as string,
          name: user?.email?.id.toUpperCase() as string,
        };
        setUserProps(newUserProps);
      }
    );
  }, []);

  const LDProps = {
    clientSideID: clientId as string,
    userProps,
  };

  return clientId ? (
    <LDProvider {...LDProps}>{props.children}</LDProvider>
  ) : (
    props.children
  );
};
