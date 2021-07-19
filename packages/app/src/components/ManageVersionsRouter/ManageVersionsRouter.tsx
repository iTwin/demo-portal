/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import { SelectionRouter } from "../SelectionRouter/SelectionRouter";
import { ManageVersions } from "./ManageVersions";

interface ManageVersionsRouterProps extends RouteComponentProps {
  accessToken: string;
  email: string;
}

export const ManageVersionsRouter = ({
  accessToken,
  email,
}: ManageVersionsRouterProps) => {
  return (
    <Router className="full-height-container">
      <SelectionRouter
        accessToken={accessToken}
        email={email}
        path="*"
        hideIModelActions={["manage-versions"]}
      />
      <ManageVersions
        accessToken={accessToken}
        path="project/:projectId/imodel/:iModelId"
      />
    </Router>
  );
};
