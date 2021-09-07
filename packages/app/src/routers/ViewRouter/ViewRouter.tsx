/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Viewer } from "@itwin/web-viewer-react";
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import { useApiData } from "../../api/useApiData";
import { useConfig } from "../../config/ConfigProvider";
import AuthClient from "../../services/auth/AuthClient";
import { SelectionRouter } from "../SelectionRouter/SelectionRouter";
import { SimpleBgMapToggleProvider } from "./UiProviders/BackgroundMap";

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
  accessToken?: string;
  iTwinId?: string;
  iModelId?: string;
  versionId?: string;
}
const View = (props: ViewProps) => {
  (window as any).ITWIN_VIEWER_HOME = window.location.origin;
  const config = useConfig();
  const buddiRegion = config.buddi?.region
    ? parseInt(config.buddi.region)
    : undefined;
  const {
    results: { namedVersion: fetchedVersion },
    state,
  } = useApiData<{ namedVersion: { changesetId: string } }>({
    accessToken: props.versionId ? props.accessToken : undefined,
    url: `https://api.bentley.com/imodels/${props.iModelId}/namedversions/${props.versionId}`,
  });
  const theme = useThemeWatcher();
  const changesetId = props.versionId ? fetchedVersion?.changesetId : undefined;
  return state || !props.versionId ? (
    <Viewer
      changeSetId={changesetId}
      contextId={props.iTwinId ?? ""}
      iModelId={props.iModelId ?? ""}
      authConfig={{ oidcClient: AuthClient.client }}
      theme={theme}
      backend={{ buddiRegion }}
      uiProviders={[new SimpleBgMapToggleProvider()]}
    />
  ) : null;
};

interface ViewRouterProps extends RouteComponentProps {
  accessToken: string;
}

export const ViewRouter = ({ accessToken }: ViewRouterProps) => {
  return (
    <Router className="full-height-container">
      <SelectionRouter
        accessToken={accessToken}
        path="*"
        hideIModelActions={["view"]}
      />
      <View path="itwin/:iTwinId/imodel/:iModelId" />
      <View
        path="itwin/:iTwinId/imodel/:iModelId/version/:versionId"
        accessToken={accessToken}
      />
    </Router>
  );
};
