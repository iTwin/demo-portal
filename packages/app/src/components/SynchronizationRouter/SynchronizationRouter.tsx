/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import { SelectionRouter } from "../SelectionRouter/SelectionRouter";
import { Synchronize } from "./Synchronize";

interface SynchronizationRouterProps extends RouteComponentProps {
  accessToken: string;
}

export const SynchronizationRouter = ({
  accessToken,
}: SynchronizationRouterProps) => {
  return (
    <Router className="full-height-container">
      <SelectionRouter
        accessToken={accessToken}
        path="*"
        hideIModelActions={["synchronize"]}
      />
      <Synchronize
        accessToken={accessToken}
        path="project/:projectId/imodel/:iModelId"
      />
    </Router>
  );
};
