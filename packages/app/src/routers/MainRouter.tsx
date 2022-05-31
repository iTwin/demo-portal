/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Redirect, Router } from "@reach/router";
import React from "react";

import { ManageVersionsRouter } from "./ManageVersionsRouter/ManageVersionsRouter";
import { MembersRouter } from "./MembersRouter/MembersRouter";
import { SynchronizationRouter } from "./SynchronizationRouter/SynchronizationRouter";
import { ViewRouter } from "./ViewRouter/ViewRouter";

interface MainRouterProps {
  accessToken: string;
}

export const MainRouter = ({ accessToken }: MainRouterProps) => {
  return (
    <Router className={"full-height-container"}>
      <ViewRouter accessToken={accessToken} path="view/*" />
      <SynchronizationRouter path="synchronize/*" accessToken={accessToken} />
      <ManageVersionsRouter
        path="manage-versions/*"
        accessToken={accessToken}
      />
      <MembersRouter path="members/*" accessToken={accessToken} />
      <Redirect noThrow={true} from="/" to="view" default={true} />
    </Router>
  );
};
