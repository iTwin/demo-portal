/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Viewer } from "@itwin/web-viewer-react";
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import { useConfig } from "../../config/ConfigProvider";
import AuthClient from "../../services/auth/AuthClient";
import { SelectionRouter } from "../SelectionRouter/SelectionRouter";

const useThemeWatcher = () => {
  const [theme, setTheme] = React.useState(() =>
    document.documentElement.classList.contains("iui-theme-dark")
      ? "dark"
      : "light"
  );
  React.useEffect(() => {
    const themeObserver = new MutationObserver((mutations) => {
      const html = mutations[0].target as HTMLElement;
      setTheme(html.classList.contains("iui-theme-dark") ? "dark" : "light");
    });
    themeObserver.observe(document.documentElement, {
      subtree: false,
      attributes: true,
      childList: false,
      characterData: false,
      attributeFilter: ["class"],
    });
    return () => themeObserver.disconnect();
  }, []);
  return theme;
};
export interface ViewProps extends RouteComponentProps {
  projectId?: string;
  iModelId?: string;
}
const View = (props: ViewProps) => {
  (window as any).ITWIN_VIEWER_HOME = window.location.origin;
  const config = useConfig();
  const buddiRegion = config.buddi?.region
    ? parseInt(config.buddi.region)
    : undefined;
  return (
    <Viewer
      contextId={props.projectId ?? ""}
      iModelId={props.iModelId ?? ""}
      authConfig={{ oidcClient: AuthClient.oidcClient }}
      theme={useThemeWatcher()}
      backend={{ buddiRegion }}
    />
  );
};

interface ViewRouterProps extends RouteComponentProps {
  accessToken: string;
  email: string;
}

export const ViewRouter = ({ accessToken, email }: ViewRouterProps) => {
  return (
    <Router className="full-height-container">
      <SelectionRouter
        accessToken={accessToken}
        email={email}
        path="*"
        hideIModelActions={["view"]}
      />
      <View path="project/:projectId/imodel/:iModelId" />
    </Router>
  );
};
