/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  MeasureTools,
  MeasureToolsUiItemsProvider,
} from "@itwin/measure-tools-react";
import {
  PropertyGridManager,
  PropertyGridUiItemsProvider,
} from "@itwin/property-grid-react";
import {
  TreeWidget,
  TreeWidgetUiItemsProvider,
} from "@itwin/tree-widget-react";
import {
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react";
import { RouteComponentProps, Router } from "@reach/router";
import React, { useCallback } from "react";

import { useApiData } from "../../api/useApiData";
import { useApiPrefix } from "../../api/useApiPrefix";
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
  accessToken?: string;
  projectId?: string;
  iModelId?: string;
  versionId?: string;
}
const View = (props: ViewProps) => {
  (window as any).ITWIN_VIEWER_HOME = window.location.origin;
  const {
    results: { namedVersion: fetchedVersion },
    state,
  } = useApiData<{ namedVersion: { changesetId: string } }>({
    accessToken: props.versionId ? props.accessToken : undefined,
    url: `https://api.bentley.com/imodels/${props.iModelId}/namedversions/${props.versionId}`,
  });
  const urlPrefix = useApiPrefix();
  (globalThis as any).IMJS_URL_PREFIX = urlPrefix ? `${urlPrefix}-` : "";
  const theme = useThemeWatcher();
  const changesetId = props.versionId ? fetchedVersion?.changesetId : undefined;
  const onIModelAppInit = useCallback(async () => {
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
  }, []);
  return (state || !props.versionId) && AuthClient.client ? (
    <Viewer
      changeSetId={changesetId}
      iTwinId={props.projectId ?? ""}
      iModelId={props.iModelId ?? ""}
      authClient={AuthClient.client}
      theme={theme}
      enablePerformanceMonitors={true}
      onIModelAppInit={onIModelAppInit}
      uiProviders={[
        new ViewerNavigationToolsProvider(),
        new ViewerContentToolsProvider({
          vertical: {
            measureGroup: false,
          },
        }),
        new ViewerStatusbarItemsProvider(),
        new TreeWidgetUiItemsProvider(),
        new PropertyGridUiItemsProvider({
          enableCopyingPropertyText: true,
        }),
        new MeasureToolsUiItemsProvider(),
      ]}
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
      <View path="project/:projectId/imodel/:iModelId" />
      <View
        path="project/:projectId/imodel/:iModelId/version/:versionId"
        accessToken={accessToken}
      />
    </Router>
  );
};
