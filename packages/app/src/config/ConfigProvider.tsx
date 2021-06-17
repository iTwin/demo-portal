/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { DemoPortalConfig } from ".";

export interface ConfigProviderProps extends DemoPortalConfig {
  children: React.ReactNode;
}

const ConfigContext = React.createContext<DemoPortalConfig>({});

export const ConfigProvider = (props: ConfigProviderProps) => {
  const { children, ...rest } = props;

  return (
    <ConfigContext.Provider value={rest}>
      {rest.ldClientId ? children : undefined}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigContext");
  }
  return context;
};
