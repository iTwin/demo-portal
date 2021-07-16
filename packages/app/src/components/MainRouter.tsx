/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Redirect, Router } from "@reach/router";
import React, { useMemo } from "react";

import { useAuth } from "./Auth/AuthProvider";
import { withAuthorization } from "./Auth/withAuthentication";
import { ManageVersionsRouter } from "./ManageVersionsRouter/ManageVersionsRouter";
import { StayTunedRouter } from "./StayTunedRouter/StayTunedRouter";
import { SynchronizationRouter } from "./SynchronizationRouter/SynchronizationRouter";
import { ViewRouter } from "./ViewRouter/ViewRouter";

export const MainRouter = () => {
  const { accessToken, userInfo } = useAuth();
  const { accessTokenStr, email } = useMemo(() => {
    return {
      accessTokenStr: accessToken?.toTokenString() ?? "",
      email: userInfo?.email?.id ?? "",
    };
  }, [accessToken, userInfo]);

  return (
    <Router className={"router"}>
      <ViewRouter accessToken={accessTokenStr} path="view/*" email={email} />
      <SynchronizationRouter
        path="synchronize/*"
        accessToken={accessTokenStr}
        email={email}
      />
      <ManageVersionsRouter
        path="manage-versions/*"
        accessToken={accessTokenStr}
        email={email}
      />
      <StayTunedRouter path="validate/*" featureName={"Validate iModel"} />
      <StayTunedRouter path="compare/*" featureName={"Version Compare"} />
      <StayTunedRouter path="query/*" featureName={"Query"} />
      <StayTunedRouter path="report/*" featureName={"Report"} />
      <StayTunedRouter
        path="ai-ml/*"
        featureName={"Artifical Intelligence - Machine Learning"}
      />
      <Redirect noThrow={true} from="/" to="view" default={true} />
    </Router>
  );
};

export const AuthorizedRouter = withAuthorization(MainRouter);
