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
  email: string;
}

export const SynchronizationRouter = ({
  accessToken,
  email,
}: SynchronizationRouterProps) => {
  return (
    <Router className="router">
      <SelectionRouter
        accessToken={accessToken}
        email={email}
        path="*"
        hideIModelActions={["synchronize"]}
      />
      <Synchronize
        accessToken={accessToken}
        email={email}
        path="project/:projectId/imodel/:iModelId"
      />
    </Router>
  );
};
