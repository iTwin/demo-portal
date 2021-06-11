/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useLDClient } from "launchdarkly-react-client-sdk";
import React from "react";

import { DemoPortalConfig } from ".";

export interface ConfigProviderProps extends DemoPortalConfig {
  children: React.ReactNode;
}

const ConfigContext = React.createContext<DemoPortalConfig>({});

export const ConfigProvider = (props: ConfigProviderProps) => {
  const { children, ...rest } = props;
  const ldClient = useLDClient();
  ldClient?.identify({ key: props.auth?.clientId });

  return (
    <ConfigContext.Provider value={rest}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigContext");
  }
  return context;
};
