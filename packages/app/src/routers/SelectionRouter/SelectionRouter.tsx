/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Redirect, RouteComponentProps, Router } from "@reach/router";
import React, { ComponentPropsWithoutRef } from "react";

import { CRUDRouter } from "../CRUDRouter/CRUDRouter";
import SelectIModel from "./SelectIModel";
import SelectProject from "./SelectProject";

interface SelectionRouterProps extends RouteComponentProps {
  accessToken: string;
  hideIModelActions?: ComponentPropsWithoutRef<
    typeof SelectIModel
  >["hideActions"];
}

export const SelectionRouter = ({
  accessToken,
  hideIModelActions,
}: SelectionRouterProps) => {
  return (
    <Router className={"full-height-container"}>
      <SelectProject accessToken={accessToken} path="/" />
      <Redirect from={"project"} to={"../"} noThrow={true} />
      <SelectIModel
        accessToken={accessToken}
        path="project/:projectId"
        hideActions={hideIModelActions}
      />
      <Redirect
        from={"project/:projectId/imodel"}
        to={"../../../project/:projectId/"}
        noThrow={true}
      />
      <CRUDRouter accessToken={accessToken} path="*" />
    </Router>
  );
};
