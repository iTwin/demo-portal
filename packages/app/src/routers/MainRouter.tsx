/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@bentley/itwin-client";
import { Redirect, Router } from "@reach/router";
import React, { useMemo } from "react";

import { ManageVersionsRouter } from "./ManageVersionsRouter/ManageVersionsRouter";
import { MembersRouter } from "./MembersRouter/MembersRouter";
import { SynchronizationRouter } from "./SynchronizationRouter/SynchronizationRouter";
import { ViewRouter } from "./ViewRouter/ViewRouter";

interface MainRouterProps {
  accessToken?: AccessToken;
}

export const MainRouter = ({ accessToken }: MainRouterProps) => {
  const accessTokenStr = useMemo(() => {
    return accessToken?.toTokenString() ?? "";
  }, [accessToken]);

  return (
    <Router className={"full-height-container"}>
      <ViewRouter accessToken={accessTokenStr} path="view/*" />
      <SynchronizationRouter
        path="synchronize/*"
        accessToken={accessTokenStr}
      />
      <ManageVersionsRouter
        path="manage-versions/*"
        accessToken={accessTokenStr}
      />
      <MembersRouter path="members/*" accessToken={accessTokenStr} />
      <Redirect noThrow={true} from="/" to="view" default={true} />
    </Router>
  );
};
