/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Viewer } from "@bentley/itwin-viewer-react";
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import AuthorizationClient from "../../AuthorizationClient";
import { SelectionRouter } from "../SelectionRouter/SelectionRouter";

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
    />
  );
};

interface ViewRouterProps extends RouteComponentProps {
  accessToken: string;
}

export const ViewRouter = ({ accessToken }: ViewRouterProps) => {
  return (
    <Router className="viewer-container">
      <SelectionRouter accessToken={accessToken} path="*" />
      <View path="project/:projectId/imodel/:iModelId" />
    </Router>
  );
};
