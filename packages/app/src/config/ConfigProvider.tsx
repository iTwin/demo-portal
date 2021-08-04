/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import React, { useEffect, useState } from "react";

import { DemoPortalConfig, getConfig } from ".";

export interface ConfigProviderProps {
  children: React.ReactNode;
}

const ConfigContext = React.createContext<DemoPortalConfig>({});

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [appConfig, setAppConfig] = useState<DemoPortalConfig>();

  useEffect(() => {
    void getConfig().then((config) => {
      setAppConfig(config);
    });
  }, []);

  return (
    <ConfigContext.Provider value={{ ...appConfig }}>
      {children}
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
