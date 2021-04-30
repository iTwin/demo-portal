import { Viewer } from "@bentley/itwin-viewer-react";
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import AuthorizationClient from "../AuthorizationClient";
import { SelectIModel } from "./SelectIModel";
import { SelectProject } from "./SelectProject";

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

export interface ViewRouteProps extends RouteComponentProps {
  accessToken: string;
}

export const ViewRoute = ({ accessToken }: ViewRouteProps) => {
  return (
    <Router className="viewer-container">
      <SelectProject accessToken={accessToken} path="/" />
      <SelectIModel accessToken={accessToken} path="project/:projectId" />
      <View path="project/:projectId/imodel/:iModelId" />
    </Router>
  );
};
