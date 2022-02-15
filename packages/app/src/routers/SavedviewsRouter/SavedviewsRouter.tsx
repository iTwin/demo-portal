/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import { SelectionRouter } from "../SelectionRouter/SelectionRouter";
import { Groups } from "./Groups";
import { Savedviews } from "./Savedviews";
import { Tags } from "./Tags";

interface SavedviewsRouterProps extends RouteComponentProps {
  accessToken: string;
}

export const SavedviewsRouter = ({ accessToken }: SavedviewsRouterProps) => {
  return (
    <Router className="full-height-container">
      <SelectionRouter
        accessToken={accessToken}
        path="*"
        hideIModelActions={["synchronize"]}
      />
      <Savedviews
        accessToken={accessToken}
        path="project/:projectId/imodel/:iModelId"
      />
      <Groups
        accessToken={accessToken}
        path="project/:projectId/imodel/:iModelId/groups"
      />
      <Tags
        accessToken={accessToken}
        path="project/:projectId/imodel/:iModelId/tags"
      />
    </Router>
  );
};
