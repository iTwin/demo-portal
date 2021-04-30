import { Viewer } from "@bentley/itwin-viewer-react";
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";
import { PropsWithChildren } from "react";

import AuthorizationClient from "../AuthorizationClient";
import { SelectIModel } from "./SelectIModel";
import { SelectProject } from "./SelectProject";

export interface ViewRouteProps extends PropsWithChildren<RouteComponentProps> {
  projectId?: string;
  iModelId?: string;
}
const View = (props: ViewRouteProps) => {
  (window as any).ITWIN_VIEWER_HOME = window.location.origin;
  return (
    <Viewer
      contextId={props.projectId ?? ""}
      iModelId={props.iModelId ?? ""}
      authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
    />
  );
};

export const ViewRoute = (props: RouteComponentProps) => {
  return (
    <Router className="viewer-container">
      <SelectProject path="/" />
      <SelectIModel path="project/:projectId" />
      <View path="project/:projectId/imodel/:iModelId" />
    </Router>
  );
};
