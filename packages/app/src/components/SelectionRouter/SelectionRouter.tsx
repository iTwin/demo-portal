/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Redirect, RouteComponentProps, Router } from "@reach/router";
import React, { ComponentPropsWithoutRef } from "react";

import { IModelCRUDRouter } from "../IModelCRUDRouter/IModelCRUDRouter";
import SelectIModel from "./SelectIModel";
import SelectProject from "./SelectProject";

interface SelectionRouterProps extends RouteComponentProps {
  accessToken: string;
  email: string;
  hideIModelActions?: ComponentPropsWithoutRef<
    typeof SelectIModel
  >["hideActions"];
}

export const SelectionRouter = ({
  accessToken,
  email,
  hideIModelActions,
}: SelectionRouterProps) => {
  return (
    <Router className={"full-height-container"}>
      <SelectProject accessToken={accessToken} path="/" />
      <Redirect from={"project"} to={"../"} noThrow={true} />
      <SelectIModel
        accessToken={accessToken}
        email={email}
        path="project/:projectId"
        hideActions={hideIModelActions}
      />
      <Redirect
        from={"project/:projectId/imodel"}
        to={"../../../project/:projectId/"}
        noThrow={true}
      />
      <IModelCRUDRouter accessToken={accessToken} path="*" />
    </Router>
  );
};
