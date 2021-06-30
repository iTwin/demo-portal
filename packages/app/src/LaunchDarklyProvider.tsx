/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@bentley/itwin-client";
import { LDUser } from "launchdarkly-js-sdk-common";
import { LDProvider, useFlags } from "launchdarkly-react-client-sdk";
import React, { useEffect, useState } from "react";

import { useConfig } from "./config/ConfigProvider";
import { DemoFlagSet } from "./ldFlagList";

export const useDemoFlags = () => {
  return useFlags() as DemoFlagSet;
};

export interface LaunchDarklyProviderProps {
  token?: AccessToken;
  children?: any;
}

export const LaunchDarklyProvider = ({
  token,
  children,
}: LaunchDarklyProviderProps) => {
  const [userProps, setUserProps] = useState<LDUser>();
  const { launchDarkly } = useConfig();

  useEffect(() => {
    if (token) {
      const user = token.getUserInfo();
      if (user) {
        const newUserProps = {
          key: user.id.toUpperCase(),
          name: user.email?.id.toUpperCase(),
          custom: {
            CountryIso:
              user.featureTracking?.usageCountryIso.toUpperCase() ?? "",
            ImsId: user.id.toUpperCase(),
            UltimateId: user.featureTracking?.ultimateSite.toUpperCase() ?? "",
          },
        };
        setUserProps(newUserProps);
      }
    }
  }, [token]);

  return launchDarkly?.clientId && userProps ? (
    <LDProvider
      clientSideID={launchDarkly.clientId}
      user={userProps}
      reactOptions={{ useCamelCaseFlagKeys: false }}
    >
      {children}
    </LDProvider>
  ) : (
    children
  );
};
