/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Viewer } from "@bentley/itwin-viewer-react";
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import AuthorizationClient from "../../AuthorizationClient";
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
  return (
    <Viewer
      contextId={props.projectId ?? ""}
      iModelId={props.iModelId ?? ""}
      authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
      theme={useThemeWatcher()}
    />
  );
};

interface ViewRouterProps extends RouteComponentProps {
  accessToken: string;
}

export const ViewRouter = ({ accessToken }: ViewRouterProps) => {
  return (
    <Router className="viewer-container router">
      <SelectionRouter accessToken={accessToken} path="*" />
      <View path="project/:projectId/imodel/:iModelId" />
    </Router>
  );
};
