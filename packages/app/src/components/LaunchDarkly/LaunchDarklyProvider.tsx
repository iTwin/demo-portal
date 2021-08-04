/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { LDUser } from "launchdarkly-js-sdk-common";
import { LDProvider, useFlags } from "launchdarkly-react-client-sdk";
import React, { useMemo } from "react";

import { useConfig } from "../../config/ConfigProvider";
import { useAuth } from "../Auth/AuthProvider";
import { DemoFlagSet } from "./ldFlagList";

export const useDemoFlags = () => {
  return useFlags() as DemoFlagSet;
};

export interface LaunchDarklyProviderProps {
  children?: any;
}

export const LaunchDarklyProvider = ({
  children,
}: LaunchDarklyProviderProps) => {
  const { launchDarkly } = useConfig();
  const { userInfo } = useAuth();

  const ldUser: LDUser | undefined = useMemo(() => {
    if (userInfo) {
      const imsId = userInfo.id.toUpperCase();
      return {
        key: imsId,
        name: userInfo.email?.id.toUpperCase(),
        custom: {
          CountryIso:
            userInfo.featureTracking?.usageCountryIso.toUpperCase() ?? "",
          ImsId: imsId,
          UltimateId:
            userInfo.featureTracking?.ultimateSite.toUpperCase() ?? "",
        },
      };
    }
  }, [userInfo]);

  return launchDarkly?.clientId && ldUser ? (
    <LDProvider
      clientSideID={launchDarkly.clientId}
      user={ldUser}
      reactOptions={{ useCamelCaseFlagKeys: false }}
    >
      {children}
    </LDProvider>
  ) : (
    children
  );
};
