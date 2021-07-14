/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React, { useEffect } from "react";

import "./App.scss";
import { AuthProvider } from "./components/Auth/AuthProvider";
import { ConfigProvider } from "./config/ConfigProvider";
import { LaunchDarklyProvider } from "./components/LaunchDarkly/LaunchDarklyProvider";
import history from "./services/router/history";
import { ai } from "./services/telemetry";
import { MainApp } from "./components/MainApp";

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
