/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import React, { useEffect } from "react";

import { AuthProvider } from "./components/Auth/AuthProvider";
import { LaunchDarklyProvider } from "./components/LaunchDarkly/LaunchDarklyProvider";
import { MainApp } from "./components/MainApp";
import { ConfigProvider } from "./config/ConfigProvider";
import history from "./services/router/history";
import { ai } from "./services/telemetry";

const App: React.FC = () => {
  useEffect(() => {
    void ai.initialize({ history });
  }, []);

  return (
    <ConfigProvider>
      <AuthProvider>
        <LaunchDarklyProvider>
          <MainApp />
        </LaunchDarklyProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
