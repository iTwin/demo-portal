/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Redirect, Router } from "@reach/router";
import React, { useMemo } from "react";

import { useAuth } from "../components/Auth/AuthProvider";
import { ManageVersionsRouter } from "./ManageVersionsRouter/ManageVersionsRouter";
import { SynchronizationRouter } from "./SynchronizationRouter/SynchronizationRouter";
import { ViewRouter } from "./ViewRouter/ViewRouter";

export const MainRouter = () => {
  const { accessToken } = useAuth();
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
      <Redirect noThrow={true} from="/" to="view" default={true} />
    </Router>
  );
};